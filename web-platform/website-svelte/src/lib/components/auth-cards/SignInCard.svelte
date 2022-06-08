<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { onMount, createEventDispatcher } from "svelte";
  import Button from "../../../lib/components/Button.svelte";

  const dispatch = createEventDispatcher();

  export let store;
  export let storyBookTest;
  export let handleTrigger;

  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const errorClass = "mzp-c-field-control mzp-c-field-control--error";
  const inputClass = "mzp-c-field-control";

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
    if (val.match(emailPattern)) {
      if (storyBookTest === false) {
        await store.loginWithEmailAndPassword(emailEl.value, passwordEl.value);
        handleNextState();
      }
    } else {
      emailErrText = "Invalid format";
      emailEl.classList.add("mzp-c-field-control--error");
    }

    if (storyBookTest === true) handleNotVerified();
  };

  const checkFields = async () => {
    if (emailEl.value === "" && passwordEl.value === "") {
      emptyFieldsErr = true;
    } else if (emailEl.value === "") {
      inputEmailClass = errorClass;
      emailErrText = "Required";
    } else if (passwordEl.value === "") {
      inputPasswordClass = errorClass;
      passwordErrText = "Required";
    } else if (emailEl) {
      checkEmail(emailEl.value);
    }
  };

  const handleChange = (e) => {
    if (e && e.key && e.key === "Enter") {
      e.preventDefault();
      checkFields();
      return;
    }
    const name = e.srcElement.name;
    inputEmailClass = inputClass;
    inputPasswordClass = inputClass;
    emptyFieldsErr = false;
    emailErrText = null;
    passwordErrText = null;

    if (name === "id_user_pw") {
      inputItemsVisible = true;
    }
  };

  const handleNotVerified = () => {
    dispatch("value", {
      value: true,
    });
  };

  const setMessage = () => {
    let userNotFound = "auth/user-not-found";
    let wrongPW = "auth/wrong-password";
    let googleOnlyAccount = "google-only-account";
    let notVerified = "Email account not verified";
    let isNotFoundErr = fireBaseErr.indexOf(userNotFound);
    let isNotPassword = fireBaseErr.indexOf(wrongPW);
    let isNotVerified = fireBaseErr.indexOf(notVerified);
    let isGoogleOnlyAccount = fireBaseErr.indexOf(googleOnlyAccount)

    if (isNotFoundErr > -1) {
      emailErrText = "Account does not exist";
      inputEmailClass = errorClass;
    }

    if (isNotPassword > -1) {
      passwordErrText = "Incorrect password";
      inputPasswordClass = errorClass;
    }

    if (isGoogleOnlyAccount > -1) {
      emailErrText = "Please sign in using your Google account instead"
      inputEmailClass = errorClass;
    }

    if (isNotVerified > -1) {
      handleNotVerified();
    }

    localStorage.removeItem("signInErr");
  };

  const handleNextState = () => {
    /* if the input fields are not empty, check for firebase errors. */
    fireBaseErr = localStorage.getItem("signInErr");
    fireBaseErr ? setMessage() : null;
  };

  const handleToggle = () => {
    passwordVisible = !passwordVisible;
  };
</script>

<div class="form-wrapper">
  <form method="post"
    on:keydown={(e) => (e.key === "Enter" && e.preventDefault())}
    on:submit={(e) => e.preventDefault()}>
    <fieldset class="mzp-c-field-set field-set">
      <div class="mzp-c-field field field--email">
        <div class="label-wrapper">
          <label class="mzp-c-field-label" for="id_user_email">Email</label>
        </div>

        <!-- **** EMAIL INPUT *** -->
        <input
          class={inputEmailClass}
          bind:this={emailEl}
          on:change={handleChange}
          on:keyup={handleChange}
          autocomplete="username"
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
          <!-- FORGOT PASSWORD -->
          <label class="mzp-c-field-label forgot-pw" for="id_user_pw">
            <a
              tabindex="-1"
              href="#forgot-password"
              on:click={() => {
                handleTrigger("forget");
              }}>Forgot password</a
            ></label
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
    <Button
    on:click={(e) => {
      e.preventDefault();
      checkFields();
    }}
    size="xl"
    customClass="card-button card-button--signin"
    btnID="signin-btn"
  >
    <div class="card-button__text">Sign in</div></Button
  >
  </form>
</div>

<style>
  .forgot-pw a {
    border-color: transparent;
    background: transparent;
    cursor: pointer;
    color: var(--color-blue-50);
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
  }

</style>
