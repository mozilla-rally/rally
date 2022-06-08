<script lang="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import Button from "../../../lib/components/Button.svelte";


  //create account states
  let email;
  let btnDisabled = true;
  let password;
  let passwordEl;
  let passwordVisible = false;

  const handleChange = () => {
    console.log("test");
  };

  const handleToggle = () => {
    passwordVisible = !passwordVisible;
    const type =
      passwordEl.getAttribute("type") === "password" ? "text" : "password";
    passwordEl.setAttribute("type", type);
  };
</script>

<div class="email-wrapper">
  <p class="card-description">Change your current email with a new one.</p>
  <div class="card-body-content">
    <form method="post">
      <fieldset class="mzp-c-field-set field-set-settings">
        <label class="mzp-c-field-label enter-pw" for="id_user_pw"
          >Enter a new email address for your account</label
        >

        <div class="mzp-c-field input-wrapper">
          <input
            class="mzp-c-field-control "
            bind:value={email}
            id="id_user_email"
            name="id_user_email"
            type="email"
            width="100%"
            placeholder="mynewemail@address.com"
            required
          />
        </div>
        <div class="mzp-c-field field-pw">
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
      disabled={btnDisabled}
      size="xl"
      customClass="card-button create btn-settings"
    >
      <div class="button-text">Save Changes</div></Button
    >
  </div>
</div>

<style>
  .email-wrapper {
    margin-top: 15px;
  }
  .card-description{
    padding-bottom: 20px; 
    width: 80%;
    font-size: 18px;
  }

  .invalid-email {
    margin-top: -19px;
    padding-bottom: 10px;
  }
</style>
