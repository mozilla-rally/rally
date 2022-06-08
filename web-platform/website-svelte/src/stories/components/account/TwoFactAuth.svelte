<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import Button from "../../../lib/components/Button.svelte";


  let password;
  let passwordEl;
  let passwordVisible = false;
  let is2FA = true;
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
</script>

<div class="two-factor-wrapper">
  <div
    class="two-factor-content"
    style="margin-bottom: 24px; box-sizing: content-box;"
  >
    <div class="lead-wrapper">
      <p class="lead" style="padding-top: 20px;">
        Enable SMS verification to sign in using a one time passcode sent as a
        SMS to your mobile phone.
      </p>
    </div>

    <div class={is2FA ? "factor-btn" : "factor-btn inactive"}>
      <Button customClass="twoFA" on:click={handleAuthToggle} size="lg"
        >{is2FA ? "Turn on" : "Turn off"}</Button
      >
    </div>
  </div>

  <form method="post">
    <fieldset class="mzp-c-field-set field-set-settings">
      <div class="mzp-c-field field-pw">
        <div class="label-wrapper">
          <label class="mzp-c-field-label enter-pw" for="id_user_number"
            >Enter your number</label
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
            >Enter your password</label
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
  <Button
    disabled={is2FA && isBlank}
    size="xl"
    custom="card-button create btn-settings"
  >
    <div class="button-text">Confirm</div></Button
  >
</div>

<style>
  .two-factor-content {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    margin: auto;
  }

  .lead-wrapper {
    width: 71%;
  }
  .lead {
    padding-bottom: 10px;
  }

  button {
    background-color: var(--color-green-50);
  }

  .number{
    padding-bottom: 15px; 
  }

  .input-first {
    margin-bottom: 15px;
  }

  .inactive button {
    background-color: var(--color-red-60) !important;
  }
</style>
