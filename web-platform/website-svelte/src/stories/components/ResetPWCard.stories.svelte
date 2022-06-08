<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { onMount } from "svelte";
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Card from "../../lib/components/Card.svelte";
  import Button from "../../lib/components/Button.svelte";

  let password;
  let passwordEl;
  let passwordVisible = false;
  let btnDisabled = true;
  let number;
  let length;
  let capital;
  let letter;
  const minPasswordLength = 8;
  let pattern = "(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}";

  let titleEl;
  let textWidth;

  onMount(async () => {
    if (titleEl) {
      await titleEl;
      textWidth = titleEl.clientWidth;
    }
  });

  $: cssVarStyles = `--titleWidth:${textWidth}px`;

  const handleToggle = () => {
    passwordVisible = !passwordVisible;
    const type =
      passwordEl.getAttribute("type") === "password" ? "text" : "password";
    passwordEl.setAttribute("type", type);
  };

  const handleChange = (e) => {
    const name = e.srcElement.name;
    if (passwordEl) {
      // Validate lowercase letters
      let lowerCaseLetters = /[a-z]/g;
      passwordEl.value.match(lowerCaseLetters)
        ? letter.classList.add("valid")
        : letter.classList.remove("valid");

      // Validate uppercase letters
      let upperCaseLetters = /[A-Z]/g;
      passwordEl.value.match(upperCaseLetters)
        ? capital.classList.add("valid")
        : capital.classList.remove("valid");

      // Validate numbers
      let numbers = /[0-9]/g;
      passwordEl.value.match(numbers)
        ? number.classList.add("valid")
        : number.classList.remove("valid");

      // Validate length
      passwordEl.value.length >= 8
        ? length.classList.add("valid")
        : length.classList.remove("valid");

      if (name === "id_user_pw") {
        if (
          password.length >= minPasswordLength &&
          passwordEl.value.match(numbers) &&
          passwordEl.value.match(lowerCaseLetters) &&
          passwordEl.value.match(upperCaseLetters)
        ) {
          btnDisabled = false;
        } else {
          btnDisabled = true;
        }
      }
    }
  };
</script>

<Meta
  title="Components/Cards/Reset Password"
  component={Card}
  argTypes={{
    title: { control: "text" },
    body: { control: "text" },
    cta1: { control: "text" },
    cta2: { control: "text" },
    width: { control: "text" },
    height: { control: "text" },
    fontSize: { control: "text" },
    bodyText: { control: "text" },
    linkText: { control: "text" },
    minHeight: { control: "text" },
    headerClass: {control: "text"}
  }}
/>

<!-- 👇 We create a “template” of how args map to rendering -->
<Template let:args>
  <div class="sb-container">
    <Card {...args}>
      <div class="title-wrapper" slot="card-title">
        <div style={cssVarStyles} class="title-highlight" />
        <div bind:this={titleEl} class="title-text">{args.title}</div>
      </div>

      <div class="card-body-content card-body-content--form" slot="card-body">
        <div class="form-wrapper">
          <form method="post">
            <fieldset class="mzp-c-field-set">
              <div class="mzp-c-field field-pw">
                <div class="label-wrapper">
                  <label class="mzp-c-field-label enter-pw" for="id_user_pw"
                    >Choose a new password</label
                  >
                </div>

                <div class="input-wrapper">
                  <input
                    class="mzp-c-field-control"
                    bind:value={password}
                    bind:this={passwordEl}
                    on:change={handleChange}
                    on:keyup={handleChange}
                    id="id_user_pw"
                    name="id_user_pw"
                    type="password"
                    min={minPasswordLength}
                    width="100%"
                    {pattern}
                    required
                  />
                  {#if passwordVisible}
                    <img
                      src="img/eye-slash.svg"
                      alt="Eye with slash across it"
                      class="fas fa-eye-slash togglePassword"
                      id="hide-eye"
                      width="24px"
                      height="24px"
                      on:click|preventDefault={handleToggle}
                    />
                  {:else}
                    <img
                      src="img/eye-open.svg"
                      alt="Open eye"
                      class="togglePassword"
                      id="show-eye"
                      width="24px"
                      height="24px"
                      on:click|preventDefault={handleToggle}
                    />
                  {/if}
                </div>

                <ul class="info-rules">
                  <li bind:this={length} id="length" class="invalid">
                    Use at least 8 characters
                  </li>
                  <li bind:this={capital} id="capital" class="invalid">
                    Use at least 1 uppercase letter
                  </li>
                  <li bind:this={letter} id="letter" class="invalid">
                    Use at least 1 lowercase letter
                  </li>
                  <li bind:this={number} id="number" class="invalid">
                    Use at least 1 number
                  </li>
                </ul>
              </div>
            </fieldset>
          </form>
          <Button disabled={btnDisabled} size="xl" customClass="card-button create">
            <div class="button-text">{args.cta1}</div></Button
          >
        </div>
      </div>
    </Card>
  </div>
</Template>

<!-- 👇 Each story then reuses that template -->
<!-- Will show when this flow is active -->
<!-- <Story
  name="Reset Password"
  args={{
    width: "460px",
    height: "400px",
    fontSize: "38px",
    title: "Reset your password",
    body: "Text",
    cta1: "Reset password",
    minHeight: "400px",
    headerClass: "signin"
  }}
/> -->

<style>
  .sb-container {
    padding: 2rem 1rem;
  }
  .title-highlight {
    width: calc(var(--titleWidth) + 15px);
  }
</style>
