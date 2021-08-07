/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// import { v4 as uuidv4 } from "uuid";
import { browser } from "webextension-polyfill-ts";

// Fall back to Chrome API for missing WebExtension polyfills.
declare var chrome: any;

// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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

export class Rally {
  static readonly SITE: string = "__RALLY_BASE_URL__";
  static readonly HOST: string = "__RALLY_HOST__";

  private _enableDevMode: boolean;
  private _rallyId: string | undefined;
  private _db: firebase.firestore.Firestore;

  _state: runStates;
  _authStateChangedCallback: (user: any) => Promise<void>;

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
   */
  constructor(enableDevMode: boolean, stateChangeCallback: (runState: runStates) => void) {
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

    chrome.runtime.onMessageExternal.addListener(
      async (m: any, s: any) => this._handleWebMessage(m, s));

    const firebaseApp = firebase.initializeApp(firebaseConfig);
    this._db = firebase.firestore(firebaseApp);

    this._authStateChangedCallback = async (user: any) => {
      if (user) {
        const usersCollection = await this._db.collection("users").get();
        const users = usersCollection.docs.map((doc: { data: () => any; }) => doc.data());

        const uid = firebase.auth().currentUser?.uid;
        const userDoc = users.find(user => user.uid === uid);

        if (userDoc?.enrolled) {
          console.debug("Enrolled in Rally");
          // FIXME this should be  proper UUIDv4 from firestore, @see https://github.com/mozilla-rally/rally-web-platform/issues/34
          this._rallyId = user.uid;
        } else {
          console.debug("Not enrolled in Rally, trigger onboarding");
          this._promptSignUp().catch(err => console.error(err));
          return;
        }

        const extensionId = chrome.runtime.id;
        let enrolled = false;
        if (extensionId in userDoc.enrolledStudies && userDoc.enrolledStudies[extensionId].enrolled) {
          console.debug("Study is enrolled");
        } else {
          console.debug("Study installed but not enrolled, trigger study onboarding");
          this._pause();
          this._promptSignUp().catch(err => console.error(err));
          return;
        }

        // If we made it this far, then the user is signed in, enrolled in Rally, and enrolled in this study.
        // Start running the study.
        this._resume();
      } else {
        // Not logged in, trigger onboarding.
        this._promptSignUp().catch(err => console.error(err));
      }
    }

    firebase.auth().onAuthStateChanged(this._authStateChangedCallback);
  }

  async _promptSignUp(study?: string) {
    const tabs = await browser.tabs.query({ url: `*://${Rally.HOST}/*` });
    // If there are any tabs with the Rally site loaded, focus the latest one.
    if (tabs && tabs.length > 0) {
      const tab: any = tabs.pop();
      browser.windows.update(tab.windowId, { focused: true });
      browser.tabs.update(tab.id, { highlighted: true, active: true });
    } else {
      // Otherwise, open the website.
      chrome.tabs.create({ url: Rally.SITE });
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
  get rallyId() {
    return this._rallyId;
  }

  /**
 * Handles messages coming in from the external website.
 *
 * @param {Object} message
 *        The payload of the message.
 * @param {runtime.MessageSender} sender
 *        An object containing information about who sent
 *        the message.
 * @returns {Promise} The response to the received message.
 *          It can be resolved with a value that is sent to the
 *          `sender` or rejected in case of errors.
 */
  async _handleWebMessage(message: { type: string, data: object }, sender: any) {
    console.log("Rally - received web message", message, "from", sender);

    try {
      // Security check - only allow messages from our own site!
      let platformURL = new URL(`https://${Rally.HOST}`);
      let senderURL = new URL(sender.url);
      if (platformURL.origin != senderURL.origin) {
        throw new Error(`Rally - received message from unexpected URL ${sender.url}`);
      }
    } catch (ex) {
      throw new Error(`Rally - cannot validate sender URL ${sender.url}: ${ex.message}`);
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

  async _completeSignUp(credential: any) {
    try {

      // Sign out existing user when new credentials are passed.
      if (firebase.auth().currentUser) {
        this._pause();
        firebase.auth().signOut();
      }

      switch (credential.providerId) {
        case authProviders.GOOGLE:
          const gCred = firebase.auth.GoogleAuthProvider.credential(credential.oauthIdToken)
          await firebase.auth().signInWithCredential(gCred);
          break;
        case authProviders.EMAIL:
          await firebase.auth().signInWithEmailAndPassword(credential.email, credential.password);
          break;
        default:
          throw new Error(`Auth provider not implemented: ${credential.providerId}`);
      }
      console.debug("logged in as:", firebase.auth().currentUser?.email);
      return true;
    } catch (ex) {
      console.error("login failed:", ex.code, ex.message);
      return false;
    }
  }
}
