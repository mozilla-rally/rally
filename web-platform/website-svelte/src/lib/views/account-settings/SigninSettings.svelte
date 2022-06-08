<script lang="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { getContext, onMount } from "svelte";
  import Card from "../../../lib/components/Card.svelte";
  import ExternalLink from "$lib/components/icons/ExternalLink.svelte";
  import moment from "moment";
  import type { AppStore } from "$lib/stores/types";

  const store: AppStore = getContext("rally:store");

  export let width;
  export let title;
  export let height;
  export let customClass;
  export let headerClass;
  export let displayCard;

  const googleAccountLink = "https://www.google.com/account";

  let userEmail;
  let timeSeconds = null;
  let createdOn;
  let userProvider;
  let getEmailStatus;

  let isGoogleOnlyAccount;
  let isUserVerified;
  let showBtn = "display: block;";
  let hideBtn = "display: none;";
  let showWarning = false;

  onMount(async () => {
    userProvider = await store.getUserProvider();
    timeSeconds = $store.user.createdOn.seconds;
    createdOn = formatDate();
    isGoogleOnlyAccount =
      userProvider &&
      userProvider.length &&
      !userProvider.some((p) => p.providerId === "password"); // no password provider means Google-only
  });

  const getLatestVerified = async () => {
    isUserVerified = await store.isUserVerified();
    return isUserVerified;
  };

  const getLatestUserEmail = async () => {
    userEmail = await store.getUserEmail();
    return userEmail;
  };

  const resendVerificationEmail = async () => {
    await store.resendUserVerificationEmail();
  };

  const formatDate = () => {
    if (timeSeconds) {
      let date = new Date(timeSeconds * 1000).toISOString();
      date = moment(date).format("ll");
      return date;
    }
  };

  $: isUserVerified = getLatestVerified();
  $: userEmail = getLatestUserEmail();
  $: getEmailStatus = localStorage.getItem("isEmailChange");
  $: if (isUserVerified === false && getEmailStatus) {
    showWarning = true;
  } else {
    showWarning = false;
  }
</script>

<Card {width} {height} {customClass} {headerClass}>
  <h2 class="title-wrapper title-wrapper--settings" slot="card-title">
    <div class="title-text title-text--settings">{title}</div>
  </h2>
  <div class="card-content card-content--settings" slot="card-content">
    <div class="content-box">
      <div class="content-box__title">Email</div>
      {#if showWarning}
      <div class="content-box__warning">
        <img src="img/icon-info-warning.svg" alt="warning icon" />
        <div>
          Email not verified. <button
            on:click={resendVerificationEmail}
            class="warning-action rwp-link"
            >Resend verification email
          </button>
        </div>
      </div>
      {/if}
      <div class="content-box__info">
        <div class="content-user-email">
          {userEmail}
        </div>
        <button
          style={isGoogleOnlyAccount ? hideBtn : showBtn}
          on:click={() => {
            displayCard("update-email");
          }}
          class="edit-btn rwp-link">Edit</button
        >
      </div>
      <hr />
      {#if isGoogleOnlyAccount}
        <div class="content-box">
          <div class="content-box__title">Connected with Google</div>
          <p class="content-box__text content-box__text--google">
            You can change your Security or Privacy settings through your Google
            Account
          </p>
          <div class="content-box__info content-box__info--google">
            <div
              class="content-box__description content-box__description--google"
            >
              <img src="img/icon-logo-google.svg" alt="Google logo" />
              <div class="google-text">
                Connected to {userEmail} on {createdOn}
              </div>
            </div>
            <a
              href={googleAccountLink}
              target="_blank"
              class="content-box__link "
              ><div>Manage account</div>
              <img
                src="img/icon-external-link_16x16.svg"
                alt="external link icon"
              /></a
            >
          </div>
        </div>
      {:else}
        <div class="content-box">
          <div class="content-box__title">Password</div>
          <div class="content-box__info">
            <div class="content-box__description password-dots">
              •••••••••••••••••
            </div>
            <button
              on:click={() => {
                displayCard("update-pw");
              }}
              class="edit-btn rwp-link">Edit</button
            >
          </div>
        </div>
      {/if}
    </div>
  </div></Card
>

<style>
  .not-verified-warning {
    color: red;
  }

  .not-verified-warning--action {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
