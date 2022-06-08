<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { createEventDispatcher } from "svelte";
  import Button from "../../../lib/components/Button.svelte";

  const dispatch = createEventDispatcher();

  let password;
  let passwordEl;
  let passwordVisible = false;
  let is2FA = false;
  let isBlank = true;

  const handleToggle = () => {
    passwordVisible = !passwordVisible;
    const type =
      passwordEl.getAttribute("type") === "password" ? "text" : "password";
    passwordEl.setAttribute("type", type);
  };

  const handleAuthToggle = () => {
    is2FA = !is2FA;
  };

  const handleChange = () => {
    console.log("test");
  };

  const handleSelect = (type) => {
    dispatch("type", {
      text: type,
    });
  };
</script>

<div class="settings-wrapper settings-wrapper--two-factor">
  <div class="two-factor-content">
    <div class={is2FA ? "two-factor__btn active" : "two-factor__btn"}>
      <Button product custom="twoFA" on:click={handleAuthToggle} size="lg"
        >{is2FA ? "Turn off" : "Turn on"}</Button
      >
    </div>

    <p class="two-factor__text">
      Two factor authentication adds and extra layer of security to your Rally
      account. Once enabled, you will receive a text message with a code to use
      when logging in.
    </p>
  </div>

  {#if is2FA}
    <form method="post">
      <fieldset class="mzp-c-field-set field-set-settings">
        <div class="mzp-c-field field-pw">
          <div class="label-wrapper">
            <label class="mzp-c-field-label enter-pw" for="id_user_number"
              >Mobile Number</label
            >
          </div>

          <div class="input-wrapper number">
            <input
              class="mzp-c-field-control"
              on:change={handleChange}
              on:keyup={handleChange}
              id="id_user_number"
              name="id_user_number"
              type="tel"
              width="100%"
              required
              disabled={is2FA}
            />
          </div>

          <div class="label-wrapper">
            <label class="mzp-c-field-label enter-pw" for="id_user_pw"
              >Password</label
            >
          </div>

          <div class="input-wrapper input-first">
            <input
              class="mzp-c-field-control"
              bind:value={password}
              bind:this={passwordEl}
              on:change={handleChange}
              on:keyup={handleChange}
              id="id_user_pw"
              name="id_user_pw"
              type="password"
              width="100%"
              required
              disabled={is2FA}
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
        </div>
      </fieldset>
    </form>
    <div class="btn-group btn-group--two-factor">
      <Button
        disabled={is2FA && isBlank}
        size="xl"
        product
        customClass="card-button create"
      >
        <div class="button-text">Enable 2FA</div></Button
      >

      <Button
        disabled={is2FA && isBlank}
        size="xl"
        customClass="card-button create"
        customControl={true}
        textColor="#0060df"
        background="transparent"
        borderColor="#0060df"
        on:click={() => {
          handleSelect("read-only");
        }}
      >
        <div class="button-text">Cancel</div></Button
      >
    </div>
  {/if}
</div>

<style>
  .number {
    padding-bottom: 15px;
  }

  .input-first {
    margin-bottom: 15px;
  }
</style>
