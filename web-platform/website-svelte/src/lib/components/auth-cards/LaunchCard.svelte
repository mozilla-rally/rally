<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { onMount, createEventDispatcher } from "svelte";
  import Card from "../../../lib/components/Card.svelte";
  import Button from "../../../lib/components/Button.svelte";
  import Signin from "./SignInCard.svelte";
  const dispatch = createEventDispatcher();

  export let title;
  export let cta1;
  export let bodyText;
  export let linkText;
  export let welcomeCard;
  export let width;
  export let height;
  export let store;
  export let storyBookTest
  export let headerClass

  let customClass = "launch";
  let notVerified = false;
  const notVerifiedText =
    "Email account is not verified. Please check your inbox and activate your account.";
  let startState;
  let titleEl;
  let textWidth;

  onMount(async () => {
    if (titleEl) {
      await titleEl;
      textWidth = titleEl.clientWidth;
    }
    localStorage.removeItem("signInErr");
  });

  $: cssVarStyles = `--titleWidth:${textWidth}px`;
  $: startState = welcomeCard ? "join" : "welcome";
  $: if(!welcomeCard){notVerified = false}

  $: if (welcomeCard) {
    setTimeout(() => {
      if (titleEl) {
        textWidth = titleEl.clientWidth;
      }
    }, 50);
  }
  $: if (!welcomeCard) {
    setTimeout(() => {
      if (titleEl) {
        textWidth = titleEl.clientWidth;
      }
    }, 50);
  }
  const handleGoogleLogin = async () => {
    localStorage.setItem("isLoading", "loading");
    loginWithGoogle();
  };

  const loginWithGoogle = async () => {
    await store.loginWithGoogle();
  };

  const handleTrigger = (type) => {
    dispatch("type", {
      text: type,
    });
  };

  const checkNotVerified = (event) => {
    notVerified = event.detail.value;
  };

</script>

<Card {width} {customClass} {height} {headerClass}>
  <h2 class="title-wrapper--launch" slot="card-title">
    <div style={cssVarStyles} class="title-highlight" />
    <div bind:this={titleEl} class="title-text">
      {title}
    </div>
  </h2>

  <div class="card-content" slot="card-content">
    {#if notVerified}
      <div class="not-verified">
        <img
          src="img/icon-info-critical.svg"
          alt="Google logo in color"
          class="card-button__img"
        />
        <p class="not-verified__text">
          {notVerifiedText}
        </p>
      </div>
    {/if}

    <!-- GOOGLE BUTTON -->
    <Button
      size="lg"
      secondary
      customClass="card-button"
      on:click={handleGoogleLogin}
    >
      <img
        width="20px"
        height="20px"
        src="img/icon-logo-google.svg"
        alt="Google logo in color"
        class="card-button__img"
      />
      <div class="card-button__text launch-button-text">{cta1}</div>
    </Button>

    {#if welcomeCard}
      <div class="line-break">
        <hr />
        <div class="line-break__text">or</div>
        <hr />
      </div>

      <Signin {store} {storyBookTest} {handleTrigger} on:value={checkNotVerified} />
    {/if}

    <!-- SIGN UP WITH EMAIL -->
    {#if !welcomeCard}
      <Button
        size="lg"
        secondary
        customClass="card-button card-button--create"
        btnID="create"
        on:click={() => handleTrigger("create")}
      >
        <img
          class="card-button__img"
          width="24px"
          height="24px"
          src="img/icon-email.svg"
          alt="Email icon"
        />
        <div class="card-button__text launch-button-text">
          Sign up with email
        </div>
      </Button>

      <p class="body-text-privacy">
        By joining, you agree to our <a class="rwp-link"
          href="__BASE_SITE__/how-rally-works/data-and-privacy/"
          >privacy notice.</a
        >
      </p>
    {/if}
  </div>

  <p slot="cta" class="body-text-action">
    {bodyText}
    <button class="rwp-link"
      on:click={() => {
        handleTrigger(startState);
      }}>{linkText}</button
    >
  </p>
</Card>

<style>
  .title-highlight {
    width: calc(var(--titleWidth) + 15px);
    transition: width 0.2s ease-in;
  }
</style>
