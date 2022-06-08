<script lang="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { createEventDispatcher } from "svelte";
  import Card from "$lib/components/Card.svelte";
  import UpdatePassword from "./UpdatePassword.svelte";
  import UpdateEmail from "./UpdateEmail.svelte";
  import CheckEmailCard from "$lib/components/auth-cards/CheckEmailCard.svelte";
  import ForgetPwCard from "$lib/components/auth-cards/ForgetPWCard.svelte";
  import DeleteAccount from "./DeleteAccount.svelte";

  const dispatch = createEventDispatcher();

  export let cardArgs;
  export let displayCard;
  export let settingsTitle;
  export let settingsDescription;
  export let isEmail;
  export let isPW;
  export let isDelete;
  export let isCheckEmail;
  export let isCheckEmailPW;
  export let isForgetPW;

  let checkEmailArgs = {
    ...cardArgs,
    title: "Check your email",
    isSettings: true,
  };

  let checkPWArgs = {
    ...checkEmailArgs,
    checkPW: true,
  };

  let checkArgs 

  let forgetPWArgs = {
    ...cardArgs,
    title: "Forgot your password?",
    isSettings: true,
    cta1: "Reset password",
    storyBookTest: false,
  };

  const handleSelect = (type) => {
    dispatch("type", {
      text: type,
    });
  };

$: isCheckEmail ? checkArgs = checkEmailArgs : checkArgs = checkPWArgs
</script>

{#if isForgetPW}
  <ForgetPwCard {...forgetPWArgs} {handleSelect} />
{:else if isCheckEmailPW || isCheckEmail}
  <CheckEmailCard {...checkArgs} />
{:else}
  <Card {...cardArgs}>
    <h2 class="title-wrapper title-wrapper--settings" slot="card-title">
      <div class="title-text">{settingsTitle}</div>
    </h2>

    {#if settingsDescription}
      <p class="settings-description">
        {settingsDescription}
      </p>
    {/if}
    <div class="card-body-content" slot="card-content">
      {#if isEmail}
        <UpdateEmail on:type={displayCard} />
      {/if}

      {#if isPW}
        <UpdatePassword on:type={displayCard} />
      {/if}

      {#if isDelete}
        <DeleteAccount on:type={displayCard} />
      {/if}
    </div>
  </Card>
{/if}

<style>
  .title-wrapper {
    justify-content: unset;
  }
</style>
