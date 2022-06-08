<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { onMount } from "svelte";
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Card from "../../lib/components/Card.svelte";
  import Button from "../../lib/components/Button.svelte";
  import Signin from "../../lib/components/auth-cards/SignInCard.svelte";

  let handleTrigger = null;
  let notVerified = false;
  let notVerifiedText =
    "Email account is not verified. Please check your inbox and activate your account.";
  let store = null;
  let titleEl;
  let textWidth;
  let test = true;

  onMount(async () => {
    if (titleEl) {
      await titleEl;
      textWidth = titleEl.clientWidth;
    }
  });

  $: cssVarStyles = `--titleWidth:${textWidth}px`;

  const checkNotVerified = (event) => {
    notVerified = event.detail.value;
  };
</script>

<Meta
  title="Components/Cards/Launch"
  component={Card}
  argTypes={{
    title: { control: "text" },
    cta1: { control: "text" },
    cta2: { control: "text" },
    width: { control: "text" },
    height: { control: "text" },
    fontSize: { control: "text" },
    bodyText: { control: "text" },
    linkText: { control: "text" },
    headerClass: {control: "text"}
  }}
/>

<!--We create a “template” of how args map to rendering -->
<Template let:args>
  <div class="sb-container">
    <Card {...args}>
      <h2 class="title-wrapper--launch" slot="card-title">
        <div style={cssVarStyles} class="title-highlight" />
        <div bind:this={titleEl} class="title-text">{args.title}</div>
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
          customControl={true}
          textColor="#000000"
          background="transparent !important"
          borderColor="#CDCDD4"
          customClass="card-button"
        >
          <img
            width="20px"
            height="20px"
            src="img/icon-logo-google.svg"
            alt="Google logo in color"
            class="card-button__img"
          />
          <div class="card-button__text launch-button-text">{args.cta1}</div>
        </Button>

        {#if args.welcomeCard}
          <div class="line-break">
            <hr />
            <div class="line-break__text">or</div>
            <hr />
          </div>

          <Signin {store} {test} {handleTrigger} on:value={checkNotVerified} />
        {/if}

        <!-- SIGN UP WITH EMAIL -->
        {#if !args.welcomeCard}
          <Button
            size="lg"
            customControl={true}
            textColor="#000000"
            background="transparent"
            borderColor="#CDCDD4"
            customClass="card-button card-button--create"
          >
            <img
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
            By joining, you agree to our <a
              href="__BASE_SITE__/how-rally-works/data-and-privacy/"
              >privacy notice</a
            >
          </p>
        {/if}
      </div>

      <p slot="cta" class="body-text-action">
        {args.bodyText} <a href="/">{args.linkText}</a>
      </p>
    </Card>
  </div>
</Template>

<!--Each story then reuses that template -->
<Story
  name="Welcome back"
  args={{
    width: "370px",
    fontSize: "38px",
    title: "Welcome Back",
    cta1: "Continue with Google",
    bodyText: "Don't have an account?",
    linkText: "Create Account",
    welcomeCard: true,
    headerClass: "signin"
  }}
/>

<Story
  name="Join Rally"
  args={{
    width: "370px",
    fontSize: "38px",
    title: "Join Rally",
    cta1: "Sign up with Google",
    cta2: "Sign up with email",
    bodyText: "Already have an account?",
    linkText: "Sign in",
    welcomeCard: false,
    headerClass: "signin"
  }}
/>

<style>
  .sb-container {
    padding: 2rem 1rem;
  }
  .title-highlight {
    width: calc(var(--titleWidth) + 15px);
  }
</style>
