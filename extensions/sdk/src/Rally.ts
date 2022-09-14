/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { initializeApp } from "firebase/app";
import {
  Auth,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  User,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import browser, { Tabs } from "webextension-polyfill";
import type { RallyOptions } from "./RallyOptions";
import { RunStates } from "./RunStates";
import { WebMessages } from "./WebMessages";

export class Rally {
  private _rallyId: string;

  private _state: RunStates;
  private _auth: Auth;
  private _db: Firestore;
  private _signedIn: boolean;

  private _options: RallyOptions;

  private _chromeStoreUrl = `https://chrome.google.com/webstore/detail`;
  private _firefoxStoreUrl = `https://addons.mozilla.org/en-US/firefox/addon`;

  private _listeners: Set<
    (
      message: unknown,
      sender: browser.Runtime.MessageSender
    ) => void | Promise<unknown>
  > = new Set();

  constructor(options: RallyOptions) {
    if (!options) {
      throw new Error("Rally.initialize - Invalid options");
    }

    if (!options.stateChangeCallback) {
      throw new Error(
        "Rally.initialize - Initialization failed, stateChangeCallback is required."
      );
    }

    if (typeof options.stateChangeCallback !== "function") {
      throw new Error(
        "Rally.initialize - Initialization failed, stateChangeCallback is not a function."
      );
    }

    this._signedIn = false;
    this._options = options;

    // Set the initial state to paused, and register callback for future changes.
    this._state = RunStates.Paused;

    if (options.enableDevMode) {
      console.debug(
        "Rally SDK - running in developer mode, not using Firebase"
      );
      const webListener = (m, s) => this.handleWebMessage(m, s);
      browser.runtime.onMessage.addListener(webListener);
      this._listeners.add(webListener);
      return;
    }

    console.debug("Rally SDK - using Firebase config:", options.firebaseConfig);
    const firebaseApp = initializeApp(options.firebaseConfig);

    this._auth = getAuth(firebaseApp);
    this._db = getFirestore(firebaseApp);

    if (options.enableEmulatorMode) {
      console.debug(
        "Rally SDK - running in Firebase emulator mode:",
        options.firebaseConfig
      );

      connectAuthEmulator(this._auth, "http://localhost:9099");
      connectFirestoreEmulator(this._db, "localhost", 8080);
    }

    this.storeAttributionCodes();
    onAuthStateChanged(this._auth, (user) =>
      this.authStateChangedCallback(user)
    );
  }

  private async getAttributionFromStore() {
    const attribution = await this.getAttributionCodes();
    if (Object.keys(attribution).length) {
      throw new Error("Attribution codes already stored");
    }

    let storeUrl = `${this._chromeStoreUrl}/${this._options.storeId}/*`;

    const browserInfo =
      browser.runtime &&
      browser.runtime.getBrowserInfo &&
      (await browser.runtime.getBrowserInfo());

    if (browserInfo && browserInfo.name === "Firefox") {
      storeUrl = `${this._firefoxStoreUrl}/${this._options.storeId}/*`;
    }

    const tabs = await browser.tabs.query({ url: storeUrl });
    if (!(tabs.length > 0)) {
      throw new Error("No store URLs present in open tabs");
    }
    const url = new URL(tabs[0].url);

    ["source", "medium", "campaign", "term", "content"].forEach((key) => {
      attribution[key] = url.searchParams.get(`utm_${key}`);
    });

    return attribution;
  }

  /**
   * Attempt to fetch the attribution codes from the store page URL for this extension.
   */
  private async storeAttributionCodes() {
    try {
      const attribution = await this.getAttributionFromStore();
      browser.storage.local.set({ attribution });
      console.debug("Attribution codes stored:", attribution);
    } catch (ex) {
      console.error("Could not store attribution codes:", ex);
    }
  }

  private async authStateChangedCallback(user: User) {
    // Record user's signed in status.
    this._signedIn = !!user;

    if (user) {
      await this.processLoggedInUser();
    } else {
      await this.promptSignUp();
    }

    const webListener = (m, s) => this.handleWebMessage(m, s);
    browser.runtime.onMessage.addListener(webListener);
    this._listeners.add(webListener);
  }

  async getAttributionCodes() {
    const attribution = await browser.storage.local.get();
    return (attribution && attribution["attribution"]) || {};
  }

  private async processLoggedInUser() {
    // This is a restricted user, which can see a minimal part of the users data.
    // The users Firebase UID is needed for this, and it is available in a custom claim on the JWT.
    const idTokenResult = await this._auth.currentUser.getIdTokenResult();
    const uid = idTokenResult.claims.firebaseUid as string;

    const getUserStudyDoc = () =>
      getDoc(doc(this._db, "users", uid, "studies", this._options.studyId));

    this.monitorUserRecord(uid);
    this.monitorCurrentStudyRecordForUser(uid);
    this.monitorCurrentStudyRecord(getUserStudyDoc);
  }

  // Monitors user record at: extensionUsers/<uid>
  private monitorUserRecord(uid: string) {
    // This contains the Rally ID, need to call the Rally state change callback with it.
    onSnapshot(doc(this._db, "extensionUsers", uid), (extensionUserDoc) => {
      if (!extensionUserDoc.exists()) {
        // User record is either not present or is somehow deleted
        // hence change the state to be logged out
        this._signedIn = false;

        throw new Error(
          "Rally onSnapshot - extensionUser document does not exist"
        );
      }

      // https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.7
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      const data = extensionUserDoc.data();

      if (data && data.rallyId) {
        if (data.rallyId.match(uuidRegex)) {
          // Stored Rally ID looks fine, cache it and call the Rally state change callback with it.
          this._rallyId = data.rallyId;
        } else {
          // Do not loop or destroy data if the stored Rally ID is invalid, bail out instead.
          throw new Error(
            `Stored Rally ID is not a valid UUID: ${data.rallyId}`
          );
        }
      }
    });
  }

  // Monitor user's current study record at: users/<uid>/studies/<studyId> and pause/resume data collection.
  private monitorCurrentStudyRecordForUser(uid: string) {
    onSnapshot(
      doc(this._db, "users", uid, "studies", this._options.studyId),
      async (userStudiesDoc) => {
        if (!userStudiesDoc.exists()) {
          // This document is created by the site and may not exist yet.
          console.warn(
            "Rally.onSnapshot - userStudies document does not exist"
          );
          return;
        }

        const data = userStudiesDoc.data();
        if (data.enrolled) {
          this.resume();
        } else {
          this.pause();
        }
      }
    );
  }

  // Monitor current study record at: studies/<studyId> and pause/resume/end data collection.
  private monitorCurrentStudyRecord(
    getUserStudyDoc: () => Promise<DocumentSnapshot<DocumentData>>
  ) {
    onSnapshot(
      doc(this._db, "studies", this._options.studyId),
      async (studiesDoc) => {
        // TODO do runtime validation of this document
        if (!studiesDoc.exists()) {
          throw new Error("Rally onSnapshot - studies document does not exist");
        }

        const data = studiesDoc.data();

        if (data.studyPaused && data.studyPaused === true) {
          if (this._state !== RunStates.Paused) {
            this.pause();
          }
        } else {
          const userStudiesDoc = await getUserStudyDoc();
          // TODO do runtime validation of this document
          if (userStudiesDoc && !userStudiesDoc.exists()) {
            // This document is created by the site and may not exist yet.
            console.warn(
              "Rally.onSnapshot - userStudies document does not exist yet"
            );
            return;
          }

          const data = userStudiesDoc.data();

          if (data.enrolled && this._state !== RunStates.Running) {
            this.resume();
          }
        }

        if (data.studyEnded === true) {
          if (this._state !== RunStates.Ended) {
            this.end();
          }
        }
      }
    );
  }

  private async promptSignUp() {
    let loadedTab: Tabs.Tab;

    const tabs = await browser.tabs.query({
      url: `${this._options.rallySite}/*`,
    });
    // If there are any tabs with the Rally site loaded, focus the latest one.
    if (tabs && tabs.length > 0) {
      loadedTab = tabs.pop();
      await browser.windows.update(loadedTab.windowId, { focused: true });
      await browser.tabs.update(loadedTab.id, {
        highlighted: true,
        active: true,
      });
      /**
       * Reload page to load content script after extension install.
       * TODO We should be able to do this without reloading the page.
       * @see https://github.com/mozilla-rally/rally/issues/6
       */
      await browser.tabs.reload();
    } else {
      // Otherwise, open the website.
      loadedTab = await browser.tabs.create({
        url: this._options.rallySite,
      });
    }
  }

  /**
   * Pause the current study.
   */
  pause() {
    if (this._state !== RunStates.Paused) {
      this._state = RunStates.Paused;
      this._options.stateChangeCallback(RunStates.Paused);
    }
  }

  /**
   * Resume the current study, if paused.
   */
  resume() {
    if (this._state !== RunStates.Running) {
      this._state = RunStates.Running;
      this._options.stateChangeCallback(RunStates.Running);
    }
  }

  /**
   * End the current study. This leaves the study installed,
   * but marks it as finished. May be resumed later (in case of error).
   *
   * @param runState
   * @param rallyId
   */
  end() {
    this._state = RunStates.Ended;
    this._options.stateChangeCallback(RunStates.Ended);
  }

  /**
   * Handles messages coming in from the external website.
   *
   * @param {Object} message
   *        The payload of the message. May be an empty object, or contain auth credential.
   *
   *        email credential: { email, password, providerId }
   *        oAuth credential: { oauthIdToken, providerId }
   *
   * @param {runtime.MessageSender} sender
   *        An object containing information about who sent
   *        the message.
   * @returns {Promise} The response to the received message.
   *          It can be resolved with a value that is sent to the
   *          `sender` or rejected in case of errors.
   */
  private async handleWebMessage(
    message: { type: WebMessages; data },
    sender: any
  ) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    if (sender.id !== browser.runtime.id) {
      throw new Error(
        `Rally.handleWebMessage - unknown sender ${sender.id}, expected ${browser.runtime.id}`
      );
    }
    if (this._options.enableDevMode) {
      console.debug(
        "Rally.handleWebMessage - received web message",
        message,
        "from",
        sender
      );
    }
    // ** IMPORTANT **
    //
    // The website should *NOT EVER* be trusted. Other addons could be
    // injecting content scripts there too, impersonating the website
    // and performing requests on its behalf.
    //
    // Do not ever add other features or messages here without thinking
    // thoroughly of the implications: can the message be used to leak
    // information out? Can it be used to mess with studies?

    switch (message.type) {
      case WebMessages.WebCheck: {
        // The `web-check` message should be safe: any installed extension with
        // the `management` privileges could check for the presence of the
        // Rally SDK and expose that to the web. By exposing this ourselves
        // through content scripts enabled on our domain, we don't make things
        // worse.
        // FIXME check internally to see if we need this yet or not.
        // Now that the site is open, send a message asking for a JWT.
        if (!this._signedIn) {
          console.debug("not signed in, sending complete_signup request");
          await browser.tabs.sendMessage(sender.tab.id, {
            type: WebMessages.CompleteSignup,
            data: {
              studyId: this._options.studyId,
              version: this._options.version,
            },
          });
        } else {
          console.debug(
            "already signed in, not sending complete_signup request"
          );
        }

        console.debug("sending web-check-response to sender:", sender, " done");
        const attribution = await this.getAttributionCodes();
        await browser.tabs.sendMessage(sender.tab.id, {
          type: WebMessages.WebCheckResponse,
          data: {
            studyId: this._options.studyId,
            version: this._options.version,
            attribution,
          },
        });
        break;
      }
      case WebMessages.CompleteSignupResponse:
        // The `complete-signup-response` message should be safe: It's a response
        // from the page, containing the credentials from the currently-authenticated user.
        //
        // Note that credentials should *NEVER* be passed to web content, but accepting them from web content
        // should be relatively safe. An attacker-controlled site (whether through MITM, rogue extension, XSS, etc.)
        // could potentially pass us a working credential that is attacker-controlled, but this should not cause the
        // extension to send data anywhere attacker-controlled, since the data collection endpoint is hardcoded and signed
        // along with the extension.
        await this.completeSignUp(message.data);

        break;
      case WebMessages.ChangeState:
        console.debug(
          "Rally SDK - received rally-sdk.change-state in dev mode"
        );

        if (!this._options.enableDevMode) {
          throw new Error(
            "Rally SDK state can only be changed directly when in developer mode."
          );
        }

        if (!message.data.state) {
          console.debug(
            `Rally SDK - No state change requested: ${message.data}`
          );
          return;
        }

        switch (message.data.state) {
          case "resume":
            console.debug("Rally SDK - dev mode, resuming study");
            if (!this._rallyId) {
              this._rallyId = uuidv4();
              console.debug(
                `Rally SDK - dev mode, generated Rally ID: ${this._rallyId}`
              );
            }

            this.resume();

            break;
          case "pause":
            console.debug("Rally SDK - dev mode, pausing study");
            this.pause();

            break;
          case "end":
            console.debug("Rally SDK - dev mode, ending study");
            this.end();

            break;
          default:
            console.debug(
              `Rally SDK - invalid state change requested: ${message.data.state}`
            );
        }

        break;
      default:
        if (this._options.enableDevMode) {
          console.debug(
            `Rally._handleWebMessage - unexpected message type "${message.type}"`
          );
        }
    }
  }

  async completeSignUp(data) {
    console.debug("Rally.completeSignUp called:", data);
    try {
      if (!data || !data.rallyToken) {
        throw new Error(
          `Rally.completeSignUp - rally token not well-formed: ${data.rallyToken}`
        );
      }

      console.debug("Rally.completeSignUp - ", data);
      // Pause study when new credentials are passed.
      if (this._auth.currentUser) {
        this.pause();
      }

      await signInWithCustomToken(this._auth, data.rallyToken);
      return true;
    } catch (ex) {
      console.error(
        "Rally.completeSignUp - signInWithCustomToken failed:",
        ex.code,
        ex.message
      );
      return false;
    }
  }

  /**
   * Returns the Rally ID, if set.
   *
   * @returns string - the Rally ID, when available.
   */
  get rallyId() {
    return this._rallyId;
  }

  get state() {
    return this._state;
  }

  /**
   * Removes any active listeners and makes it safe to re-instantiate.
   * Intended for tests, it's unlikely an extension would want to do this.
   */
  shutdown() {
    this._listeners.forEach((listener) =>
      browser.runtime.onMessage.removeListener(listener)
    );
  }
}
