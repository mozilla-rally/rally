<script lang="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { onMount, createEventDispatcher } from "svelte";
  import { getContext } from "svelte";
  import type { AppStore } from "$lib/stores/types";
  import Button from "../../../lib/components/Button.svelte";

  const dispatch = createEventDispatcher();
  const store: AppStore = getContext("rally:store");
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const errorClass = "mzp-c-field-control mzp-c-field-control--error";
  const inputClass = "mzp-c-field-control";

  let btnDisabled = true;
  let emailEl;
  let emailErrText = null;
  let emptyFieldsErr;
  let fireBaseErr = null;
  let inputEmailClass;
  let inputPasswordClass;
  let inputItemsVisible = false;
  let passwordEl;
  let passwordErrText = null;
  let passwordVisible = false;

  onMount(() => {
    inputEmailClass = inputClass;
    inputPasswordClass = inputClass;
  });

  $: if (emptyFieldsErr) {
    inputEmailClass = errorClass;
    inputPasswordClass = errorClass;
    emailErrText = "Required";
    passwordErrText = "Required";
  }

  const checkEmail = async (val) => {
    if (!val.match(emailPattern)) {
      emailErrText = "Invalid format";
      emailEl.classList.add("mzp-c-field-control--error");
      return;
    }

    if (val.match(emailPattern)) {
      changeEmail();
      handleNextState();
    }
  };

  async function changeEmail() {
    try {
      await store.changeEmail(emailEl.value, passwordEl.value);
    } catch (err) {
      console.error("Error while changing the email", err)
    }
    
  };

  const checkFields = async () => {
    const isEmailAbsent = !emailEl.value;
    const isPasswordAbsent = !passwordEl.value;
    if (isEmailAbsent && isPasswordAbsent) {
      emptyFieldsErr = true;
      return;
    }
    if (isEmailAbsent) {
      inputEmailClass = errorClass;
      emailErrText = "Required";
      return;
    }
    if (isPasswordAbsent) {
      inputPasswordClass = errorClass;
      passwordErrText = "Required";
      return;
    }
    // Both are present
    checkEmail(emailEl.value);
  };

  const handleChange = (e) => {
    const name = e.srcElement.name;
    inputEmailClass = inputClass;
    inputPasswordClass = inputClass;
    emptyFieldsErr = false;
    emailErrText = null;
    passwordErrText = null;
    btnDisabled = false;
    if (name === "id_user_pw") {
      inputItemsVisible = true;
    }
    if (emailEl && passwordEl) {
      if (emailEl.value === "" && passwordEl.value === "") {
        btnDisabled = true;
      }
    }
  };

  const handleNextState = () => {
    /* Check for firebase errors and display if needed. */
    fireBaseErr = localStorage.getItem("changeEmailErr") || localStorage.getItem("authErr");
    fireBaseErr ? setMessage() : clearFields();
  };

  const handleSelect = (type) => {
    dispatch("type", {
      text: type,
    });
  };

  const setMessage = () => {
    let wrongPW = "auth/wrong-password";
    let emailAlready = "auth/email-already-in-use";
    let emailIsCurrent = "email-is-current-email";
    let isNotPassword = fireBaseErr.indexOf(wrongPW);
    let isEmailAlready = fireBaseErr.indexOf(emailAlready);
    let isEmailCurrent = fireBaseErr.indexOf(emailIsCurrent);

    if (isNotPassword > -1) {
      passwordErrText =
        "The password you entered is incorrect. Please try again.";
      inputPasswordClass = errorClass;
    }
    if (isEmailAlready > -1) {
      emailErrText =
        "The email you entered is already in use. Please try another email.";
      inputEmailClass = errorClass;
    }
    if (isEmailCurrent > -1) {
      emailErrText = "This is already the email address for this account.";
      inputEmailClass = errorClass;
    }

    localStorage.removeItem("authErr");
    localStorage.removeItem("changeEmailErr");
  };

  const handleToggle = () => {
    passwordVisible = !passwordVisible;
  };

  const clearFields = () => {
    emailEl.value = "";
    passwordEl.value = "";
    localStorage.setItem("isEmailChange", "true");
    handleSelect("check-email");
  };
</script>

<div class="settings-wrapper settings-wrapper--email">
  <div class="card-body-content">
    <form method="post">
      <fieldset class="mzp-c-field-set field-set">
        <div class="mzp-c-field field field--email">
          <div class="label-wrapper">
            <label class="mzp-c-field-label enter-pw" for="id_user_pw"
              >New email address</label
            >
          </div>
          <!-- **** EMAIL INPUT *** -->
          <input
            class={inputEmailClass}
            bind:this={emailEl}
            on:change={handleChange}
            on:keyup={handleChange}
            id="id_user_email"
            name="id_user_email"
            type="email"
            width="100%"
            required
          />

          {#if emailErrText}
            <p class="error-msg error-msg--email">
              {emailErrText}
            </p>
          {/if}
        </div>

        <div class="mzp-c-field field field--pw">
          <div class="label-wrapper">
            <label class="mzp-c-field-label enter-pw" for="id_user_pw"
              >Password</label
            >
          </div>

          <div class="input-wrapper">
            <!-- **** PASSWORD INPUT *** -->
            <input
              class={inputPasswordClass}
              bind:this={passwordEl}
              on:change={handleChange}
              on:keyup={handleChange}
              autocomplete="current-password"
              id="id_user_pw"
              name="id_user_pw"
              type={passwordVisible ? "text" : "password"}
              width="100%"
              required
            />
            <img
              src={passwordVisible
                ? "img/icon-password-show.svg"
                : "img/icon-password-hide.svg"}
              alt={passwordVisible ? "open eye" : "eye with slash"}
              class={`toggle-password ${
                inputItemsVisible ? "create-show" : "create-hide"
              }`}
              id="show-eye"
              width="24px"
              height="24px"
              on:click={handleToggle}
            />
          </div>
          {#if passwordErrText}
            <p class="error-msg error-msg--password">
              {passwordErrText}
            </p>
          {/if}
        </div>
      </fieldset>
    </form>

    <div class="card-bottom">
      <!-- FORGOT PASSWORD -->
      <label class="mzp-c-field-label forgot-pw" for="id_user_pw">
        <button
          on:click={() => {
            handleSelect("forget-pw");
          }}>Forgot password?</button
        ></label
      >

      <div class="btn-group btn-group--email">
        <Button
          size="xl"
          customClass="card-button cancel"
          secondary
          on:click={() => {
            handleSelect("read-only");
          }}
        >
          <div class="button-text">Cancel</div></Button
        >

        <Button
          disabled={btnDisabled}
          size="xl"
          customClass="card-button create"
          product
          on:click={checkFields}
        >
          <div class="button-text">Update email</div></Button
        >
      </div>
    </div>
  </div>
</div>

<style>
  input {
    width: 100%;
  }
</style>
