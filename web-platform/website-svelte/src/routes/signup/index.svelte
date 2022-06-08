<script lang="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { onMount, getContext } from "svelte";
  import { goto } from "$app/navigation";
  import * as state from "$lib/components/auth-cards/state.svelte";
  import LaunchCard from "$lib/components/auth-cards/LaunchCard.svelte";
  import CreateCard from "$lib/components/auth-cards/CreateCard.svelte";
  import ForgetPwCard from "$lib/components/auth-cards/ForgetPWCard.svelte";
  import CheckEmailCard from "$lib/components/auth-cards/CheckEmailCard.svelte";
  import ResetPwCard from "$lib/components/auth-cards/ResetPWCard.svelte";
  import ExternalLink from "$lib/components/icons/ExternalLink.svelte";
  import type { AppStore } from "$lib/stores/types";

  const store: AppStore = getContext("rally:store");

  let isLoading = false;
  let loadingText = localStorage.getItem("isLoading");

  onMount(() => {
    localStorage.removeItem("isLoading");
  });

  let {
    cardArgs,
    welcomeArgs,
    joinArgs,
    createArgs,
    forgetPWArgs,
    checkEmailPWArgs,
    checkEmailArgs,
    resetPWArgs,
  } = state;

  let {
    welcomeCard,
    joinCard,
    createAcctCard,
    forgetPWCard,
    checkEmailCard,
    checkEmailPWCard,
    resetPWCard,
  } = state.card;

  $: if ($store._initialized) {
    if (!$store?.user?.uid) {
      goto("/signup");
    } else if (!$store?.user?.enrolled) {
      goto("/welcome/terms");
    } else {
      goto("/studies");
    }
  }

  $: if (welcomeCard) {
    cardArgs = welcomeArgs;
  } else if (joinCard) {
    cardArgs = joinArgs;
  } else if (createAcctCard) {
    cardArgs = createArgs;
  } else if (forgetPWCard) {
    cardArgs = forgetPWArgs;
  } else if (checkEmailPWCard) {
    cardArgs = checkEmailPWArgs;
  } else if (checkEmailCard) {
    cardArgs = checkEmailArgs;
  } else if (resetPWCard) {
    cardArgs = resetPWArgs;
  }

  $: if (loadingText === "loading") isLoading = true;

  const resetState = () => {
    isLoading = false;
    welcomeCard = true;
    joinCard = false;
    createAcctCard = false;
    forgetPWCard = false;
    resetPWCard = false;
    checkEmailCard = false;
    checkEmailPWCard = false;
    state.card.cardHeight = "auto";
  };

  const triggerCard = (event) => {
    let text = event.detail.text;
    switch (text) {
      case "join":
        welcomeCard = false;
        joinCard = true;
        break;
      case "welcome":
        resetState();
        break;
      case "create":
        joinCard = false;
        createAcctCard = true;
        break;
      case "forget":
        welcomeCard = false;
        forgetPWCard = true;
        break;
      case "reset":
        checkEmailPWCard = false;
        resetPWCard = true;
        break;
      case "check-pw":
        forgetPWCard = false;
        checkEmailPWCard = true;
        break;
      case "check-create":
        createAcctCard = false;
        forgetPWCard = false;
        checkEmailCard = true;
        break;
      default:
        break;
    }
  };

  const sendUserInfo = (info) => {
    userEmail = info;
  };
</script>

<section class="signin md-container-signin">
  <h2 class="mzp-c-call-out-title mzp-has-zap-1 signin__logo">
    <img src="img/logo-wide.svg" alt="Mozilla Rally Logo" />
  </h2>

  <div class="cards-wrapper signin__cards">
    {#if isLoading}
      <div class="spinner-wrapper">
        <svg
          class="spinner"
          width="100px"
          height="100px"
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            class="path"
            fill="none"
            stroke-width="6"
            stroke-linecap="round"
            cx="33"
            cy="33"
            r="30"
          />
        </svg>
      </div>
    {/if}

    {#if !isLoading}
      {#if welcomeCard || joinCard}
        <LaunchCard
          {...cardArgs}
          {store}
          on:type={triggerCard}
          storyBookTest={false}
          {welcomeCard}
        />
      {/if}

      {#if createAcctCard && !welcomeCard && !joinCard}
        <CreateCard
          {...cardArgs}
          {store}
          on:type={triggerCard}
          storyBookTest={false}
        />
      {/if}

      {#if (checkEmailCard || checkEmailPWCard) && !welcomeCard && !joinCard}
        <CheckEmailCard
          isSettings={false}
          {...cardArgs}
          on:type={triggerCard}
        />
      {/if}

      {#if forgetPWCard && !welcomeCard && !joinCard && !createAcctCard && !checkEmailCard}
        <ForgetPwCard
          {...cardArgs}
          on:type={triggerCard}
          storyBookTest={false}
        />
      {/if}

      {#if resetPWCard && !checkEmailPWCard}
        <ResetPwCard {...cardArgs} on:type={triggerCard} />
      {/if}
    {/if}
  </div>

  <div class="how-it-works signin__howitworks">
    <a
      class="external-link rwp-link"
      target="_blank"
      rel="noopener noreferrer"
      href="__BASE_SITE__/how-rally-works/"
      >Wait – how does it work again?
      <ExternalLink /></a
    >
  </div>
</section>

<style>
  .spinner-wrapper {
    text-align: center;
  }
</style>
