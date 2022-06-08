<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { onMount, createEventDispatcher } from "svelte";
  import Card from "../../../lib/components/Card.svelte";
  import Button from "../../../lib/components/Button.svelte";

  const dispatch = createEventDispatcher();

  export let title;
  export let cta1;
  export let width;
  export let customClass;
  export let height;
  export let headerClass;

  let titleEl;
  let textWidth;
  let btnDisabled = true;
  let password;
  let passwordEl;
  let capital;
  let number;
  let length;
  let letter;
  let passwordVisible = false;
  const minPasswordLength = 8;
  let pattern = "(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}";

  onMount(async () => {
    if (titleEl) {
      await titleEl;
      textWidth = titleEl.clientWidth;
    }
  });

  $: cssVarStyles = `--titleWidth:${textWidth}px`;

  const handleTrigger = (type) => {
    dispatch("type", {
      text: type,
    });
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

  const handleToggle = () => {
    passwordVisible = !passwordVisible;
    const type =
      passwordEl.getAttribute("type") === "password" ? "text" : "password";
    passwordEl.setAttribute("type", type);
  };
</script>

<Card {width} {customClass} {height} {headerClass}>
  <h2 class="title-wrapper" slot="card-title">
    <div style={cssVarStyles} class="title-highlight" />
    <div bind:this={titleEl} class="title-text">{title}</div>
  </h2>

  <div class="card-content card-content--resetpw" slot="card-content">
    <div class="form-wrapper">
      <form method="post">
        <fieldset class="mzp-c-field-set field-set">
          <div class="mzp-c-field field field--pw">
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
                autocomplete="new-password"
                id="id_user_pw"
                name="id_user_pw"
                type="password"
                {pattern}
                min={minPasswordLength}
                width="100%"
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
                Use least 8 characters
              </li>
              <li bind:this={letter} id="letter" class="invalid">
                Use least 1 lowercase letter
              </li>
              <li bind:this={capital} id="capital">
                Use least 1 uppercase letter
              </li>
              <li bind:this={number} id="number" class="invalid">
                Use least 1 number
              </li>
            </ul>
          </div>
        </fieldset>
      </form>

      <Button
        on:click={() => {
          handleTrigger("welcome");
        }}
        disabled={btnDisabled}
        size="xl"
        customClass="card-button card-button--create"
      >
        <div class="button-text">{cta1}</div></Button
      >
    </div>
  </div>
</Card>

<style>
  .title-highlight {
    width: calc(var(--titleWidth) + 15px);
  }
</style>
