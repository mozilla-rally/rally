<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import * as state from "../../lib/components/auth-cards/state.svelte";
  import Card from "../../lib/components/Card.svelte";
  import LaunchCard from "../../lib/components/auth-cards/LaunchCard.svelte";
  import CreateCard from "../../lib/components/auth-cards/CreateCard.svelte";
  import ForgetPwCard from "../../lib/components/auth-cards/ForgetPWCard.svelte";
  import CheckEmailCard from "../../lib/components/auth-cards/CheckEmailCard.svelte";
  import ResetPwCard from "../../lib/components/auth-cards/ResetPWCard.svelte";
  import ExternalLink from "../../lib/components/icons/ExternalLink.svelte";
  import { fly } from "svelte/transition";

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

  const resetState = () => {
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
</script>

<Meta title="Pages/SignIn" component={Card} argTypes={state.card.argTypes} />

<Template let:args>
  <section class="signin md-container-signin">
    <h2
      class="mzp-c-call-out-title mzp-has-zap-1 signin__logo"
      in:fly={{ duration: 800, y: 5 }}
    >
      <img src="img/logo-wide.svg" alt="Mozilla Rally Logo" />
    </h2>

    <div class="cards-wrapper signin__cards">
      {#if welcomeCard || joinCard}
        <LaunchCard
          {...cardArgs}
          store={null}
          storyBookTest={true}
          on:type={triggerCard}
          {welcomeCard}
        />
      {/if}

      {#if createAcctCard && !welcomeCard && !joinCard}
        <CreateCard
          {...cardArgs}
          store={null}
          storyBookTest={true}
          on:type={triggerCard}
        />
      {/if}

      {#if (checkEmailCard || checkEmailPWCard) && !welcomeCard && !joinCard}
        <CheckEmailCard {...cardArgs} on:type={triggerCard} />
      {/if}

      {#if forgetPWCard && !welcomeCard}
        <ForgetPwCard
          {...cardArgs}
          store={null}
          on:type={triggerCard}
          storyBookTest={true}
        />
      {/if}

      {#if resetPWCard && !checkEmailPWCard}
        <ResetPwCard {...cardArgs} on:type={triggerCard} />
      {/if}
    </div>

    <div class="how-it-works signin__howitworks">
      <a
        class="external-link"
        target="_blank"
        rel="noopener noreferrer"
        href="__BASE_SITE__/how-rally-works/"
        >Wait – how does it work again?
        <ExternalLink /></a
      >
    </div>
  </section>
</Template>

<Story name="SignIn" args={cardArgs} />
