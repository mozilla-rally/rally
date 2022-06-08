<script lang="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { onMount, createEventDispatcher } from "svelte";
  import { getContext } from "svelte";
  import type { NotificationStore } from "$lib/components/notifications";
  import type { AppStore } from "$lib/stores/types";
  import Button from "../../../lib/components/Button.svelte";

  const dispatch = createEventDispatcher();
  const store: AppStore = getContext("rally:store");
  const notifications: NotificationStore = getContext("rally:notifications");

  const errorClass = "mzp-c-field-control mzp-c-field-control--error";
  const inputClass = "mzp-c-field-control";
  const lowerCaseLetters = /[a-z]/g;
  const numbers = /[0-9]/g;
  const minPasswordLength = 8;
  const pattern = "(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}";
  const upperCaseLetters = /[A-Z]/g;

  let btnDisabled = true;
  let inputItemsVisible = false;
  let capital;
  let number;
  let length;
  let letter;
  let emptyFieldsErr;
  let fireBaseErr = null;
  let oldPassword = {
    inputPasswordClass: "",
    passwordEl: null,
    passwordVisible: false,
    passwordErrText: null,
    showIcon: false,
  };
  let newPassword = {
    inputPasswordClass: "",
    passwordEl: null,
    passwordVisible: false,
    passwordErrText: null,
    showIcon: false,
  };
  let confirmPassword = {
    inputPasswordClass: "",
    passwordEl: null,
    passwordVisible: false,
    passwordErrText: null,
    showIcon: false,
  };

  onMount(() => {
    oldPassword.inputPasswordClass = inputClass;
    newPassword.inputPasswordClass = inputClass;
    confirmPassword.inputPasswordClass = inputClass;
  });

  const checkFields = async () => {
    const isOldAbsent = !oldPassword.passwordEl.value;
    const isNewAbsent = !newPassword.passwordEl.value;
    const isConfirmAbsent = !confirmPassword.passwordEl.value;
    if (isOldAbsent && isNewAbsent && isConfirmAbsent) {
      emptyFieldsErr = true;
      return;
    }
    if (isOldAbsent) {
      oldPassword.inputPasswordClass = errorClass;
      oldPassword.passwordErrText = "Required";
      return;
    }
    if (isNewAbsent) {
      newPassword.inputPasswordClass = errorClass;
      newPassword.passwordErrText = "Required";
      return;
    }
    if (isConfirmAbsent) {
      confirmPassword.inputPasswordClass = errorClass;
      confirmPassword.passwordErrText = "Required";
      return;
    }
    //all fields are filled
    checkRules();
  };

  const checkRules = () => {
    const newPasswordEl = newPassword.passwordEl;
    if (newPasswordEl) {
      newPasswordEl.value.length < minPasswordLength
        ? length.classList.add("rules-error")
        : null;
      newPasswordEl.value.match(lowerCaseLetters)
        ? letter.classList.add("clear")
        : letter.classList.add("rules-error");
      newPasswordEl.value.match(upperCaseLetters)
        ? capital.classList.add("clear")
        : capital.classList.add("rules-error");
      newPasswordEl.value.match(numbers)
        ? number.classList.add("clear")
        : number.classList.add("rules-error");
      if (
        newPasswordEl.value.length >= minPasswordLength &&
        !newPasswordEl.value.match(numbers) &&
        !newPasswordEl.value.match(lowerCaseLetters) &&
        !newPasswordEl.value.match(upperCaseLetters)
      ) {
        rulesError();
        return;
      }
    }
    //if rules are clear, handle making sure new and confirm passwords match
    handleCheckPW();
  };

  const clearFields = () => {
    oldPassword.passwordEl.value = newPassword.passwordEl.value = confirmPassword.passwordEl.value =
      "";
    let success = localStorage.getItem("resetPW");
    resetState();
    if (!success) {
      console.info("Something went wrong");
      return;
    }
    if (success) {
      notifications.send({ code: "SUCCESSFULLY_UPDATED_PASSWORD" });
      localStorage.removeItem("resetPW");
    }
  };

  const handleCheckPW = async () => {
    const oldPasswordEl = oldPassword.passwordEl;
    const newPasswordEl = newPassword.passwordEl;
    const confirmPasswordEl = confirmPassword.passwordEl;

    if (newPasswordEl && confirmPasswordEl && oldPasswordEl) {
      if (!newPasswordEl.value === confirmPasswordEl.value) {
        newPassword.inputPasswordClass = errorClass;
        confirmPassword.inputPasswordClass = errorClass;
        confirmPassword.passwordErrText = "Passwords do not match.";
        return;
      }
      if (newPasswordEl.value === confirmPasswordEl.value) {
        await store.resetUserPassword(newPasswordEl.value, oldPasswordEl.value);
      }
      handleNextState();
    }
  };

  const handleChange = (e) => {
    const newPasswordEl = newPassword.passwordEl;
    const isOldAbsent = !oldPassword.passwordEl.value;
    const isNewAbsent = !newPassword.passwordEl.value;
    const isConfirmAbsent = !confirmPassword.passwordEl.value;
    const name = e.srcElement.name;
    btnDisabled = false;
    resetState();

    letter.classList.remove("rules-error");
    capital.classList.remove("rules-error");
    number.classList.remove("rules-error");
    length.classList.remove("rules-error");

    if (
      oldPassword.passwordEl &&
      newPassword.passwordEl &&
      confirmPassword.passwordEl
    ) {
      if (isOldAbsent && isNewAbsent && isConfirmAbsent) {
        btnDisabled = true;
      } else btnDisabled = false;
    }
    if (newPasswordEl) {
      newPassword.inputPasswordClass = inputClass;
      if (name === "id_user_pw--new") {
        newPassword.showIcon = true;
        inputItemsVisible = true;
        // Validate lowercase letters
        newPassword.passwordEl.value.match(lowerCaseLetters)
          ? letter.classList.add("valid")
          : letter.classList.remove("valid");
        // Validate uppercase letters
        newPassword.passwordEl.value.match(upperCaseLetters)
          ? capital.classList.add("valid")
          : capital.classList.remove("valid");
        // Validate numbers
        newPassword.passwordEl.value.match(numbers)
          ? number.classList.add("valid")
          : number.classList.remove("valid");
        // Validate length
        newPassword.passwordEl.value.length >= minPasswordLength
          ? length.classList.add("valid")
          : length.classList.remove("valid");
      }
      switch (name) {
        case "id_user_pw--current":
          oldPassword.showIcon = true;
          break;
        case "id_user_pw--confirm":
          confirmPassword.showIcon = true;
          break;
        default:
          break;
      }
    }
  };

  const handleNextState = () => {
    /* if the input fields are not empty, check for firebase errors. */
    fireBaseErr =
      localStorage.getItem("authErr") || localStorage.getItem("changePWErr");
    fireBaseErr ? setMessage() : clearFields();
  };

  const rulesError = () => {
    newPassword.inputPasswordClass = errorClass;
    newPassword.passwordErrText = "Required";
    return;
  };

  const setMessage = () => {
    let wrongPW = "auth/wrong-password";
    let isNotPassword = fireBaseErr.indexOf(wrongPW);
    if (isNotPassword > -1) {
      oldPassword.passwordErrText =
        "The password you entered is incorrect. Please try again.";
      oldPassword.inputPasswordClass = errorClass;
    }
    localStorage.removeItem("authErr");
    localStorage.removeItem("changePWErr");
  };

  const handleSelect = (type) => {
    dispatch("type", {
      text: type,
    });
  };

  const handleToggle = (i) => {
    switch (i) {
      case "type0":
        oldPassword.passwordVisible = !oldPassword.passwordVisible;
        break;
      case "type1":
        newPassword.passwordVisible = !newPassword.passwordVisible;
        break;
      case "type2":
        confirmPassword.passwordVisible = !confirmPassword.passwordVisible;
        break;
      default:
        break;
    }
  };

  const resetState = () => {
    oldPassword.inputPasswordClass = newPassword.inputPasswordClass = confirmPassword.inputPasswordClass = inputClass;
    emptyFieldsErr = false;
    oldPassword.passwordErrText = newPassword.passwordErrText = confirmPassword.passwordErrText = null;
    inputItemsVisible = false;
  };

  $: if (emptyFieldsErr) {
    oldPassword.inputPasswordClass = newPassword.inputPasswordClass = confirmPassword.inputPasswordClass = errorClass;
    oldPassword.passwordErrText = newPassword.passwordErrText = confirmPassword.passwordErrText =
      "Required";
  }
</script>

<div class="settings-wrapper settings-wrapper--password">
  <div class="card-body-content">
    <form method="post">
      <fieldset class="mzp-c-field-set field-set-settings">
        <div class="mzp-c-field field-pw">
          <div class="label-wrapper">
            <label class="mzp-c-field-label enter-pw" for="id_user_pw"
              >Current password</label
            >
          </div>

          <div class="input-wrapper input-wrapper--curent">
            <input
              class={oldPassword.inputPasswordClass}
              bind:this={oldPassword.passwordEl}
              on:change={handleChange}
              on:keyup={handleChange}
              autocomplete="current-password"
              id="id_user_pw"
              name="id_user_pw--current"
              type={oldPassword.passwordVisible ? "text" : "password"}
              {pattern}
              width="100%"
              required
            />
            <img
              src={oldPassword.passwordVisible
                ? "img/icon-password-show.svg"
                : "img/icon-password-hide.svg"}
              alt={oldPassword.passwordVisible ? "open eye" : "eye with slash"}
              class={`toggle-password ${
                oldPassword.showIcon ? "create-show" : "create-hide"
              }`}
              id="show-eye"
              width="24px"
              height="24px"
              on:click|preventDefault={() => handleToggle("type0")}
            />
            {#if oldPassword.passwordErrText}
              <p class="error-msg error-msg--password">
                {oldPassword.passwordErrText}
              </p>
            {/if}
          </div>

          <!--NEW PASSWORD -->
          <div class="label-wrapper">
            <label class="mzp-c-field-label enter-pw" for="id_user_pw"
              >New password</label
            >
          </div>
          <div class="input-wrapper input-wrapper--new">
            <input
              class={newPassword.inputPasswordClass}
              bind:this={newPassword.passwordEl}
              on:change={handleChange}
              on:keyup={handleChange}
              autocomplete="new-password"
              id="id_user_pw id_user_pw--new"
              name="id_user_pw--new"
              type={newPassword.passwordVisible ? "text" : "password"}
              {pattern}
              width="100%"
              required
            />
            <img
              src={newPassword.passwordVisible
                ? "img/icon-password-show.svg"
                : "img/icon-password-hide.svg"}
              alt={newPassword.passwordVisible ? "open eye" : "eye with slash"}
              class={`toggle-password ${
                newPassword.showIcon ? "create-show" : "create-hide"
              }`}
              id="show-eye"
              width="24px"
              height="24px"
              on:click|preventDefault={() => handleToggle("type1")}
            />
            {#if newPassword.passwordErrText}
              <p class="error-msg error-msg--password">
                {newPassword.passwordErrText}
              </p>
            {/if}
          </div>

          <ul
            class={`password-requirements ${
              inputItemsVisible ? "create-show" : "create-hide"
            }`}
          >
            <li bind:this={length} id="length">Use at least 8 characters</li>
            <li bind:this={letter} id="letter">
              Use at least 1 lowercase letter
            </li>
            <li bind:this={capital} id="capital">
              Use at least 1 uppercase letter
            </li>
            <li bind:this={number} id="number">Use at least 1 number</li>
          </ul>

          <!--NEW PASSWORD END -->

          <!--CONFIRM PASSWORD -->
          <div class="label-wrapper">
            <label class="mzp-c-field-label enter-pw" for="id_user_pw"
              >Confirm new password</label
            >
          </div>
          <div class="input-wrapper">
            <input
              class={confirmPassword.inputPasswordClass}
              bind:this={confirmPassword.passwordEl}
              on:change={handleChange}
              on:keyup={handleChange}
              autocomplete="new-password"
              id="id_user_pw"
              name="id_user_pw--confirm"
              type={confirmPassword.passwordVisible ? "text" : "password"}
              {pattern}
              width="100%"
              required
            />
            <img
              src={confirmPassword.passwordVisible
                ? "img/icon-password-show.svg"
                : "img/icon-password-hide.svg"}
              alt={confirmPassword.passwordVisible
                ? "open eye"
                : "eye with slash"}
              class={`toggle-password ${
                confirmPassword.showIcon ? "create-show" : "create-hide"
              }`}
              id="show-eye"
              width="24px"
              height="24px"
              on:click|preventDefault={() => handleToggle("type2")}
            />
            {#if confirmPassword.passwordErrText}
              <p class="error-msg error-msg--password">
                {confirmPassword.passwordErrText}
              </p>
            {/if}
          </div>
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

      <div class="btn-group btn-group--password">
        <Button
          size="xl"
          customClass="card-button create cancel"
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
          product
          customClass="card-button create"
          on:click={checkFields}
        >
          <div class="button-text">Update password</div></Button
        >
      </div>
    </div>
  </div>
</div>

<style>
  form {
    height: auto;
  }
  .input-wrapper {
    margin-bottom: 30px;
  }
  .info-msg-active-reset {
    text-align: left;
    font-size: 12px;
    color: gray;
  }
  .info-rules {
    margin-bottom: 15px;
  }
  .input-wrapper--new {
    margin-bottom: 10px;
  }
  .password-requirements {
    padding: 0px 24px 14px;
  }
  .field-set-settings {
    margin-bottom: 0;
  }
  .btn-group--password {
    margin-top: 0;
  }
  .field-pw {
    padding-bottom: 0;
  }
</style>
