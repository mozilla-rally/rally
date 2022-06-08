<script lang="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { onMount, createEventDispatcher, getContext } from "svelte";
  import Card from "../../../lib/components/Card.svelte";
  import Button from "../../../lib/components/Button.svelte";
  import type { AppStore } from "$lib/stores/types";

  const dispatch = createEventDispatcher();
  const store: AppStore = getContext("rally:store");

  export let title;
  export let cta1;
  export let width;
  export let height;
  export let isSettings;
  export let storyBookTest;
  export let headerClass;
  export let customClass;
  export let handleSelect;

  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const errorClass = "mzp-c-field-control mzp-c-field-control--error";
  const inputClass = "mzp-c-field-control";
  let emailEl;
  let inputEmailClass;
  let fireBaseErr = null;
  let requestErrText = "";
  let titleEl;
  let textWidth;

  onMount(async () => {
    if (titleEl) {
      await titleEl;
      textWidth = titleEl.clientWidth;
    }
    inputEmailClass = inputClass;
  });

  $: cssVarStyles = `--titleWidth:${textWidth}px`;

  const checkEmail = (val) => {
    if (val.match(emailPattern)) {
      if (storyBookTest === false) {
        handleForgetPassword();
      }
    } else {
      requestErrText = "Invalid format";
      inputEmailClass = errorClass;
    }
  };

  const checkFields = async () => {
    if (emailEl.value === "") {
      requestErrText = "Required";
      inputEmailClass = errorClass;
    } else if (emailEl) {
      checkEmail(emailEl.value);
    }
  };

  const handleChange = () => {
    inputEmailClass = inputClass;
    requestErrText = null;
  };

  const handleForgetPassword = async () => {
    emailEl.value = emailEl.value.trim();
    if (emailEl.value) {
      await store.sendUserPasswordResetEmail(emailEl.value);
      handleNextState();
    }
  };

  const handleNextState = () => {
    fireBaseErr = localStorage.getItem("resetPasswordErr");
    if (fireBaseErr) {
      setMessage();
      return;
    }

    if (isSettings) {
      handleSelect("check-email-pw");
      return;
    }

    handleTrigger("check-pw");
  };

  const handleTrigger = (type) => {
    dispatch("type", {
      text: type,
    });
  };

  const setMessage = () => {
    let userNotFound = "auth/user-not-found";
    let isNotFoundErr = fireBaseErr.indexOf(userNotFound);

    if (isNotFoundErr > -1) {
      requestErrText = "Account does not exist.";
      inputEmailClass = errorClass;
    }

    localStorage.removeItem("resetPasswordErr");
  };
</script>

<Card {width} {customClass} {height} {headerClass}>
  <h2 class="title-wrapper" slot="card-title">
    <div style={cssVarStyles} class="title-highlight" />
    <div bind:this={titleEl} class="title-text">{title}</div>
  </h2>

  <div class="card-content card-content--forgetpw" slot="card-content">
    <p class="card-body-info">
      Enter your email and we'll send you a link to reset your password.
    </p>
    <div class="form-wrapper form-wrapper--forgetpw">
      <form method="post">
        <fieldset class="mzp-c-field-set field-set">
          <div class="mzp-c-field field field--email">
            <div class="label-wrapper">
              <label class="mzp-c-field-label" for="id_user_email">Email</label>
            </div>
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
            <!-- ERROR MESSAGE -->
            {#if requestErrText}
              <p class="error-msg error-msg--resetpw">
                {@html requestErrText}
              </p>
            {/if}
          </div>
        </fieldset>
      </form>

      <Button
        on:click={checkFields}
        size="xl"
        customClass="card-button card-button--signin"
      >
        <div class="card-button__text">{cta1}</div></Button
      >

      {#if !isSettings}
        <p class="body-text-action">
          Back to <button
            class="rwp-link"
            on:click={() => {
              handleTrigger("welcome");
            }}><a href="/signup">sign in</a></button
          >
        </p>
      {/if}
    </div>
  </div>
</Card>

<style>
  .title-highlight {
    width: calc(var(--titleWidth) + 15px);
    transition: width 0.2s ease-in;
  }
</style>
