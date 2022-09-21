import type { FirebaseOptions } from "firebase/app";
import type { RunStates } from "./RunStates";

/**
 * Options to initialize the Rally library.
 */
export interface RallyOptions {
  /* Whether or not to initialize Rally.js in developer mode.
   * In this mode we do not attempt to connect to Firebase,
   * and allow messages to enable/disable enrollment.
   */
  readonly enableDevMode: boolean;

  /**
   * A function to call when the study is paused or running.
   * Takes a single parameter, `message`, which is the {String}
   * received regarding the current study state ("paused" or "running".)
   */
  stateChangeCallback: (state: RunStates) => void;

  /**
   * A string containing the Rally Web Platform site.
   */
  readonly rallySite: string;

  /**
   * A string containing the unique name of the study,
   * separate from the Firefox add-on ID and Chrome extension ID.
   */
  readonly studyId: string;

  /**
   * Version of study
   */
  readonly version: string;

  /**
   * A string containing the unique name of the extension on the extension store,
   * either Firefox AMO or the Chrome Web Store.
   */
  readonly storeId: string;

  /**
   * An object containing the Firebase backend configuration.
   */
  readonly firebaseConfig: FirebaseOptions;

  /**
   * Whether or not to initialize Rally.js in emulator mode.
   * In this mode the SDK attempts to use a local Firebase emulator.
   * Note that the firebaseConfig must still be provided.
   */
  readonly enableEmulatorMode: boolean;

  /**
   * Functions host to use for backend services.
   */
  readonly functionsHost: URL;
}
