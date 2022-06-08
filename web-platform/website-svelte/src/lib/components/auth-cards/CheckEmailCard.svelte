<script type="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { onMount, createEventDispatcher, getContext } from "svelte";
  import Card from "../../../lib/components/Card.svelte";
  import Button from "../../../lib/components/Button.svelte";

  import type { AppStore } from "$lib/stores/types";

  const store: AppStore = getContext("rally:store");

  const dispatch = createEventDispatcher();

  export let title;
  export let width;
  export let height;
  export let customClass;
  export let checkPW;
  export let ctaText;
  export let linkText;
  export let headerClass;
  export let isSettings;

  let body;
  let titleEl;
  let textWidth;
  let userEmail;
  let checkEmailText;

  onMount(async () => {
    if (titleEl) {
      await titleEl;
      textWidth = titleEl.clientWidth;
    }
    userEmail = await store.getUserEmail();
  });

  const handleTrigger = (type) => {
    dispatch("type", {
      text: type,
    });
  };

  $: cssVarStyles = `--titleWidth:${textWidth}px`;
  $: resetPWText = `Instructions to reset your password have been sent to ${userEmail}`;
  $: isSettings === true
    ? (checkEmailText = `Successfully sent email change request. To finish updating, please follow instructions sent to ${userEmail}`)
    : (checkEmailText = `To finish creating your account with Rally, please check your email inbox and verify your email address.`);
  $: checkPW ? (body = resetPWText) : (body = checkEmailText);
</script>

<Card {width} {customClass} {height} {headerClass}>
  <h2 class="title-wrapper" slot="card-title">
    <div style={cssVarStyles} class="title-highlight" />
    <div bind:this={titleEl} class="title-text">{title}</div>
  </h2>

  <div class="card-content card-content--info" slot="card-content">
    <p class="card-content__text">{body}</p>
    {#if !isSettings}
      <Button
        on:click={() => {
          handleTrigger("welcome");
        }}
        size="xl"
        customClass="card-button card-button--reset"
        btnID="back-signin-btn"
      >
        <div class="card-button__text rwp-link">Back to sign in</div></Button
      >
    {/if}
  </div>

  <div slot="cta" class="body-text-action body-text-action--check-email">
    {#if !isSettings}
      <p class="contact-text">
        {ctaText} <a href="/">{linkText}</a>
      </p>
    {/if}
  </div>
</Card>

<style>
  .title-highlight {
    width: calc(var(--titleWidth) + 15px);
  }

  .contact-text {
    margin: 0;
  }
</style>
