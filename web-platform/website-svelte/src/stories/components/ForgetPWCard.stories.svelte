<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { onMount } from "svelte";
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Card from "../../lib/components/Card.svelte";
  import Button from "../../lib/components/Button.svelte";

  let email;
  let emailEl;
  let btnDisabled = true;
  let titleEl;
  let textWidth;

  onMount(async () => {
    if (titleEl) {
      await titleEl;
      textWidth = titleEl.clientWidth;
    }
  });

  $: cssVarStyles = `--titleWidth:${textWidth}px`;

  const handleChange = (e) => {
    if (emailEl) {
      emailEl.value.length > 0 ? (btnDisabled = false) : (btnDisabled = true);
    }
  };
</script>

<Meta
  title="Components/Cards/Forgot Password"
  component={Card}
  argTypes={{
    title: { control: "text" },
    cta1: { control: "text" },
    width: { control: "text" },
    height: { control: "text" },
    fontSize: { control: "text" },
    bodyText: { control: "text" },
    minHeight: { control: "text" },
    custom: { control: "text" },
    headerClass: {control: "text"}
  }}
/>

<!-- 👇 We create a “template” of how args map to rendering -->
<Template let:args>
  <div class="sb-container">
    <Card {...args}>
      <h2 class="title-wrapper" slot="card-title">
        <div style={cssVarStyles} class="title-highlight" />
        <div bind:this={titleEl} class="title-text">{args.title}</div>
      </h2>

      <div
        class="card-body-content card-body-content--forgetpw"
        slot="card-content"
      >
        <p class="card-body-info">
          Enter your email and we'll send you a link to reset your password.
        </p>
        <div class="form-wrapper form-wrapper--forgetpw">
          <form method="post">
            <fieldset class="mzp-c-field-set field-set">
              <div class="mzp-c-field field field--email">
                <div class="input-wrapper">
                  <input
                    class="mzp-c-field-control"
                    bind:value={email}
                    bind:this={emailEl}
                    on:change={handleChange}
                    on:keyup={handleChange}
                    id="id_user_email"
                    name="id_user_email"
                    type="email"
                    width="100%"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
            </fieldset>
          </form>
          <Button disabled={btnDisabled} size="xl" customClass="modal-button create">
            <div class="button-text--signin">{args.cta1}</div></Button
          >
          <p class="body-text-action">
            {args.bodyText}
          </p>
        </div>
      </div>
    </Card>
  </div>
</Template>

<!-- 👇 Each story then reuses that template -->

<Story
  name="Forgot Password"
  args={{
    width: "391px",
    height: "auto",
    fontSize: "38px",
    title: "Forgot your password?",
    cta1: "Reset password",
    bodyText: "We'll send you a link to reset your password.",
    headerClass: "signin"
  }}
/>

<style>
  .sb-container {
    padding: 2rem 1rem;
  }
  .title-highlight {
    width: calc(var(--titleWidth) + 15px);
    transition: width 0.2s ease-in;
  }
</style>
