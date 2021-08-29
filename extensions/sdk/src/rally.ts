/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { v4 as uuidv4 } from "uuid";
import { browser } from "webextension-polyfill-ts";

// Fall back to Chrome API for missing WebExtension polyfills.
declare var chrome: any;

import { initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

// @ts-ignore - FIXME provide type
import firebaseConfig from "../config/firebase.config.js";
import { extension } from "webextension-polyfill";

export enum runStates {
  RUNNING,
  PAUSED,
}

export enum authProviders {
  GOOGLE = "google.com",
  EMAIL = "email",
}

export enum webMessages {
  WEB_CHECK = "web-check",
  COMPLETE_SIGNUP = "complete-signup",
  WEB_CHECK_RESPONSE = "web-check-response",
  COMPLETE_SIGNUP_RESPONSE = "complete-signup-response",
}

enum routes {
  ONBOARD = "onboard",
  SIGNUP = "signup"
}

export class Rally {
  private _enableDevMode: boolean;
  private _rallyId: string | undefined;

  _state: runStates;
  _authStateChangedCallback: (user: any) => Promise<void>;
  _auth: any;
  _db: any;
  _rallySite: string;
  private _port: any;

  /**
   * Initialize the Rally library.
   *
   * @param {Boolean} enableDevMode
   *        Whether or not to initialize Rally.js in developer mode.
   *        In this mode we ignore problems when communicating with
   *        core add-on.
   *
   * @param {Function} stateChangeCallback
   *        A function to call when the study is paused or running.
   *        Takes a single parameter, `message`, which is the {String}
   *        received regarding the current study state ("paused" or "running".)
   *
   * @param {String} rallySite
   *        A string containing the Rally Web Platform site.
   */
  constructor(enableDevMode: boolean, stateChangeCallback: (runState: runStates) => void, rallySite: string) {
    if (!stateChangeCallback) {
      throw new Error("Rally.initialize - Initialization failed, stateChangeCallback is required.")
    }

    if (typeof stateChangeCallback !== "function") {
      throw new Error("Rally.initialize - Initialization failed, stateChangeCallback is not a function.")
    }

    this._enableDevMode = Boolean(enableDevMode);

    // Set the initial state to paused, and register callback for future changes.
    this._state = runStates.PAUSED;
    this._stateChangeCallback = stateChangeCallback;

    console.debug("Rally site set to:", rallySite);
    this._rallySite = rallySite;
    const firebaseApp = initializeApp(firebaseConfig);

    this._auth = getAuth(firebaseApp);
    this._db = getFirestore(firebaseApp);

    // @ts-ignore
    if (__INTEGRATION_TEST_MODE__) {
      connectAuthEmulator(this._auth, 'http://localhost:9099');
      connectFirestoreEmulator(this._db, 'localhost', 8080);
    }

    this._authStateChangedCallback = async (user: any) => {
      console.debug("_authStateChangedCallback fired");
      if (user) {
        // This is a restricted user, which can see a minimal part of the users data.
        // The users Firebase UID is needed for this, and it is available in a custom claim on the JWT.
        const idTokenResult = await this._auth.currentUser.getIdTokenResult();
        const uid = idTokenResult.claims.firebaseUid;

        // This contains the Rally ID, need to call the Rally state change callback with it.
        onSnapshot(doc(this._db, "extensionUsers", uid), async extensionUserDoc => {
          // https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.7
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

          const data = extensionUserDoc.data();
          const rallyId = data.rallyId;

          if (rallyId) {
            if (rallyId.match(uuidRegex)) {
              // Stored Rally ID looks fine, cache it and call the Rally state change callback with it.
              this._rallyId = rallyId;
              this._stateChangeCallback(this._state, this._rallyId);
            } else {
              // Do not loop or destroy data if the stored Rally ID is invalid, bail out instead.
              throw new Error(`Stored Rally ID is not a valid UUID: ${rallyId}`);
            }
          } else {
            // If the Rally ID does not exist, generate and store it. This will cause onSnapshot to be called
            // again, so no need for anything else.
            const newRallyId = uuidv4();
            setDoc(doc(this._db, "extensionUsers", uid), { rallyId: newRallyId }, { merge: true });
          }
        });

        onSnapshot(doc(this._db, "users", uid, "studies", "exampleStudy1"), async userStudiesDoc => {
          const data = userStudiesDoc.data();
          if (data.enrolled) {
            this._stateChangeCallback(runStates.RUNNING, this._rallyId);
          } else {
            this._stateChangeCallback(runStates.PAUSED, this._rallyId);
          }
        });
      } else {
        this._promptSignUp(routes.SIGNUP).catch(err => console.error(err));
      }
    }

    onAuthStateChanged(this._auth, this._authStateChangedCallback);

    browser.runtime.onConnect.addListener((port) => {
      console.debug("Rally - bg port connected");
      port.onMessage.addListener((m, s) => this._handleWebMessage(m, s));
    });
  }

  async _checkEnrollment(user: any, userData: any) {
    if (userData?.enrolled) {
      console.debug("Enrolled in Rally");
      return true;
    } else {
      console.debug("Not enrolled in Rally:", user, userData);
      return false;
    }
  }

  async _checkStudyEnrollment(user: any, userData: any) {
    const extensionId = browser.runtime.id;
    let enrolled = false;
    if ("enrolledStudies" in userData
      && extensionId in userData.enrolledStudies
      // FIXME this check seems redundant, shouldn't presence in `enrolledStudies` be enough?
      && userData.enrolledStudies[extensionId].enrolled) {
      console.debug("Current study is enrolled");

      // If we made it this far, then the user is signed in, enrolled in Rally, and enrolled in this study.
      return true;
    } else {
      console.debug("Current study installed but not enrolled");
      return false;
    }
  }

  async _promptSignUp(reason: string, study?: string) {
    let route: string = "";
    switch (reason) {
      case routes.ONBOARD:
        if (study) {
          // FIXME we should trigger the individual study route = `studies/${study}`;
          route = `studies`;
        }
        break;
      case routes.SIGNUP:
        route = "signup";
        break;
      default:
        throw new Error(`_promptSignUp: unknown sign-up reason ${reason} for study ${study}`);
    }

    const tabs = await browser.tabs.query({ url: `${this._rallySite}/${route}` });
    // If there are any tabs with the Rally site loaded, focus the latest one.
    if (tabs && tabs.length > 0) {
      const tab: any = tabs.pop();
      browser.windows.update(tab.windowId, { focused: true });
      browser.tabs.update(tab.id, { highlighted: true, active: true });
    } else {
      // Otherwise, open the website.
      chrome.tabs.create({
        url: `${this._rallySite}/${route}`
      });
    }
  }

  /**
   * Pause the current study.
   */
  _pause() {
    if (this._state !== runStates.PAUSED) {
      this._state = runStates.PAUSED;
      this._stateChangeCallback(runStates.PAUSED, this._rallyId);
    }
  }

  /**
   * Resume the current study, if paused.
   */
  _resume() {
    if (this._state !== runStates.RUNNING) {
      this._state = runStates.RUNNING;
      this._stateChangeCallback(runStates.RUNNING, this._rallyId);
    }
  }

  private _stateChangeCallback(runState: runStates, rallyId: string) {
    throw new Error("Method not implemented, must be provided by study.");
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
  async _handleWebMessage(message: { type: webMessages, data: {} }, sender: any) {
    console.log("Rally - received web message", message, "from", sender);
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
      case webMessages.WEB_CHECK:
        // The `web-check` message should be safe: any installed extension with
        // the `management` privileges could check for the presence of the
        // Rally SDK and expose that to the web. By exposing this ourselves
        // through content scripts enabled on our domain, we don't make things
        // worse.
        return {
          type: webMessages.WEB_CHECK_RESPONSE,
          data: {}
        }
      case webMessages.COMPLETE_SIGNUP:
        // The `complete-signup` message should be safe: It's a one-direction
        // communication from the page, containing the credentials from the currently-authenticated user.
        //
        // Note that credentials should *NEVER* be passed to web content, but accepting them from web content
        // should be relatively safe. An attacker-controlled site (whether through MITM, rogue extension, XSS, etc.)
        // could potentially pass us a working credential that is attacker-controlled, but this should not cause the
        // extension to send data anywhere attacker-controlled, since the data collection endpoint is hardcoded and signed
        // along with the extension.
        const signedUp = await this._completeSignUp(message.data);
        return { type: webMessages.COMPLETE_SIGNUP_RESPONSE, data: { signedUp } };
      default:
        throw new Error(`Rally._handleWebMessage - unexpected message type "${message.type}"`);
    }
  }

  async _completeSignUp(data) {
    try {
      console.debug("Rally._completeSignUp - ", data);
      // Pause study when new credentials are passed.
      if (this._auth.currentUser) {
        this._pause();
      }

      await signInWithCustomToken(this._auth, data.rallyToken);
      console.debug("logged in as:", this._auth.currentUser?.email);
      return true;
    } catch (ex) {
      console.error("login failed:", ex.code, ex.message);
      return false;
    }
  }
}
