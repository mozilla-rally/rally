/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { writable } from "svelte/store";
import type { Readable, Writable } from "svelte/store";
import { browser } from "$app/env";
import firestoreAPI from "./api";
import type { AppStore, State } from "./types";

export function createAppStore(api = firestoreAPI): AppStore {
  const _store: Writable<State> = writable({ _initialized: false });
  const { subscribe, set } = _store;

  api.initialize(browser).then((state) => {
    set(state);
  });

  api.onNextState((state) => {
    const nextState = { ...state, _initialized: true };
    set(nextState);
  });

  return {
    subscribe,
    set,
    async loginWithGoogle() {
      return api.loginWithGoogle();
    },
    async loginWithEmailAndPassword(email, password) {
      return api.loginWithEmailAndPassword(email, password);
    },
    async signupWithEmailAndPassword(email, password) {
      return api.signupWithEmailAndPassword(email, password);
    },
    async signOutUser() {
      return api.signOutUser();
    },
    async sendUserPasswordResetEmail(email) {
      return api.sendUserPasswordResetEmail(email);
    },
    async resetUserPassword(newPassword, oldPassword) {
      return api.resetUserPassword(newPassword, oldPassword)
    },
    async changeEmail(email, password) {
      return api.changeEmail(email, password)
    },
    async isUserVerified() {
      return api.isUserVerified()
    },
    async resendUserVerificationEmail() {
      return api.resendUserVerificationEmail()
    },
    async getUserEmail() {
      return api.getUserEmail()
    },
    async getUserProvider(){
      return api.getUserProvider()
    },
    async deleteUserAccount(password){
      return api.deleteUserAccount(password)
    },
    async updateOnboardedStatus(onboardingOrNot) {
      return api.updateOnboardedStatus(onboardingOrNot);
    },
    async updateStudyEnrollment(studyId, enroll) {
      // Enforce the truthyness of `enroll`, to make sure
      // it's always a boolean.
      const coercedEnroll = !!enroll;
      console.debug(
        `Rally - changing study ${studyId} enrollment to ${coercedEnroll}`
      );

      // send study enrollment message
      try {
        return await api.updateStudyEnrollment(studyId, coercedEnroll);
      } catch (err) {
        console.error(err);
      }
    },
    async updatePlatformEnrollment(enroll) {
      // Enforce the truthyness of `enroll`, to make sure
      // it's always a boolean.
      const coercedEnroll = !!enroll;
      console.debug(`Rally - changing enrollment to ${coercedEnroll}`);

      // send the Rally enrollment message
      try {
        return await api.updatePlatformEnrollment(coercedEnroll);
      } catch (err) {
        console.error(err);
      }
    },
    async updateDemographicSurvey(data) {
      try {
        await api.updateDemographicSurvey(data);
      } catch (err) {
        console.error("Rally - failed to update the demographic survey", err);
      }
    },
  };
}

/**
 * Creates a store whose value is a boolean that logs whether the current user is
 * authenticated into Rally or not.
 * @returns WritableStore<boolean>["subscribe"]
 */
function isAuthenticatedStore(): Readable<boolean> {
  const { subscribe, set } = writable(undefined);
  firestoreAPI.onAuthStateChanged((authState) => {
    set(authState !== null);
  });
  return { subscribe };
}

export const isAuthenticated = browser
  ? isAuthenticatedStore()
  : writable(undefined);

/**
 * Creates a store whose value is a boolean that logs whether the Rally extension
 * is present or not.
 * @returns WritableStore<boolean>["subscribe"]
 */
function isExtensionConnectedStore(): Readable<boolean> {
  const { subscribe, set } = writable(undefined);
  set(false);
  firestoreAPI.onExtensionConnected((studyId) => {
    set(true)
  });
  return { subscribe };
}

export const isExtensionConnected = browser
  ? isExtensionConnectedStore()
  : writable(undefined);

export const store = browser ? createAppStore() : writable(undefined);
