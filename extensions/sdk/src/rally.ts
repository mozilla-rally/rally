/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// import { v4 as uuidv4 } from "uuid";
import { browser } from "webextension-polyfill-ts";

// Fall back to Chrome API for missing WebExtension polyfills.
declare var chrome: any;

import { initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { getFirestore, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

// @ts-ignore - FIXME provide type
import firebaseConfig from "../config/firebase.config.js";

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

    this._rallyId = undefined;

    // Set the initial state to paused, and register callback for future changes.
    this._state = runStates.PAUSED;
    this._stateChangeCallback = stateChangeCallback;

    console.debug("Rally site set to:", rallySite);
    this._rallySite = rallySite;
    const firebaseApp = initializeApp(firebaseConfig);

    this._auth = getAuth(firebaseApp);
    this._db = getFirestore(firebaseApp);

    this._authStateChangedCallback = async (user: any) => {
      console.debug("_authStateChangedCallback fired");
      if (user) {
        const uid = this._auth.currentUser?.uid;

        onSnapshot(doc(this._db, "users", uid), async userDoc => {
          console.debug("onSnapshot for users fired");
          if (!userDoc.exists) {
            throw new Error("No profile exists for this user on the server.");
          }

          const user = this._auth.currentUser;

          const userData = userDoc.data();
          // FIXME validate schema

          const enrolled = !!await this._checkEnrollment(user, userData);
          if (!enrolled) {
            if (this._state !== runStates.PAUSED) {
              this._pause();
            }
            if (userData) {
              userData.enrolledStudies[browser.runtime.id].attached = false;
              setDoc(doc(this._db, "users", uid), { enrolledStudies: userData.enrolledStudies }, { merge: true });
            }
            this._promptSignUp(routes.ONBOARD).catch(err => console.error(err));
            return;
          }

          const studyEnrolled = !!await this._checkStudyEnrollment(user, userData)
          if (!studyEnrolled) {
            if (this._state !== runStates.PAUSED) {
              this._pause();
            }
            // FIXME this can interfere with onboarding, site needs to handle it
            // this._promptSignUp(routes.ONBOARD, browser.runtime.id).catch(err => console.error(err));
            return;
          }

          // check the study state before resuming
          const studyDoc = await getDoc(doc(this._db, "studies", browser.runtime.id));
          const studyData = studyDoc.data();

          if (!(studyData?.studyPaused && studyData.studyEnded)) {
            if (userData) {
              userData.enrolledStudies[browser.runtime.id].attached = true;
              setDoc(doc(this._db, "users", uid), { enrolledStudies: userData.enrolledStudies }, { merge: true });
            }
            this._resume();
          }
        });
      } else {
        this._promptSignUp(routes.SIGNUP).catch(err => console.error(err));
      }
    }

    connectAuthEmulator(this._auth, 'http://localhost:9099');
    onAuthStateChanged(this._auth, this._authStateChangedCallback);

    onSnapshot(doc(this._db, "studies", browser.runtime.id), async studyDoc => {
      console.debug("onSnapshot for studies fired");
      if (!studyDoc.exists) {
        throw new Error("No record of this study exists on server.");
      }

      const studyData = studyDoc.data();
      // FIXME validate schema

      if (studyData?.studyPaused) {
        console.info(`Rally study ${studyData.name} is paused.`);
        this._pause();
        return;
      } else {
        // check enrollment first
        const user = this._auth.currentUser;
        if (!user) {
          return;
        }
        const userDoc = await getDoc(doc(this._db, "users", user.uid));
        const userData = userDoc.data();

        const enrolled = !!this._checkEnrollment(user, userData);
        if (userData) {
          userData.enrolledStudies[browser.runtime.id].attached = true;
          setDoc(doc(this._db, "users", user.uid), { enrolledStudies: userData.enrolledStudies }, { merge: true });
        }
        if (enrolled && this._state !== runStates.RUNNING) {
          this._resume();
        } else if (this._state !== runStates.PAUSED) {
          this._pause();
        }
      }

      if (studyData?.studyEnded) {
        console.info(`Rally study ${studyData.name} has ended, uninstalling.`);
        await browser.management.uninstallSelf();
        return;
      }
    });

    this._port;
    browser.runtime.onConnect.addListener((port) => {
      console.debug("Rally - bg port connected");
      this._port = port;
      this._port.onMessage.addListener((m, s) => this._handleWebMessage(m, s));
    });
  }

  async _checkEnrollment(user: any, userData: any) {
    if (userData?.enrolled) {
      console.debug("Enrolled in Rally");
      // FIXME this should be  proper UUIDv4 from firestore, @see https://github.com/mozilla-rally/rally-web-platform/issues/34
      this._rallyId = user.uid;
      return true;
    } else {
      console.debug("Not enrolled in Rally");
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
      this._stateChangeCallback(runStates.PAUSED);
    }
  }

  /**
   * Resume the current study, if paused.
   */
  _resume() {
    if (this._state !== runStates.RUNNING) {
      this._state = runStates.RUNNING;
      this._stateChangeCallback(runStates.RUNNING);
    }
  }

  private _stateChangeCallback(runState: runStates) {
    throw new Error("Method not implemented, must be provided by study.");
  }

  /**
   * Get the Rally ID, if set.
   *
   * @returns {String} rallyId
   *        The Rally ID (if set).
   */
  get rallyId(): string | undefined {
    return this._rallyId;
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
