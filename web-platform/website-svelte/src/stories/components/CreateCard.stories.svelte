<script>
  import { onMount } from "svelte";
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Card from "../../lib/components/Card.svelte";
  import Button from "../../lib/components/Button.svelte";

  //create account states
  let checkEmail = false;
  let emailEl;
  let formHeight = "auto";
  let inputClassName = "mzp-c-field-control";
  let inputEmailName;
  let inputPWName;
  let inputItemsVisible = false;
  let passwordEl;
  let passwordVisible = false;
  let titleEl;
  let textWidth;

  //password requirements
  let capital;
  let number;
  let numbers = /[0-9]/g;
  const minPasswordLength = 8;
  let length;
  let letter;
  let lowerCaseLetters = /[a-z]/g;
  let pattern = "(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}";
  let upperCaseLetters = /[A-Z]/g;

  //error states
  let createErr = false;
  let emailErrText = null;
  let emptyFieldsErr;
  let fireBaseErr = null;
  let passwordErr = false;
  let passwordErrText = null;

  onMount(async () => {
    if (titleEl) {
      await titleEl;
      textWidth = titleEl.clientWidth;
    }

    inputEmailName = inputClassName;
    inputPWName = inputClassName;
  });

  $: cssVarStyles = `--titleWidth:${textWidth}px`;
  $: formStyles = `--formHeight:${formHeight}`;
  $: emptyFieldsErr
    ? (inputClassName = "mzp-c-field-control mzp-c-field-control--error")
    : (inputClassName = "mzp-c-field-control");
  $: inputEmailName = inputClassName;
  $: inputPWName = inputClassName;
  $: if (emptyFieldsErr) {
    emailErrText = "Required";
    passwordErrText = "Required";
  }

  const checkFields = async () => {
    if (emailEl.value === "" && passwordEl.value === "") {
      emptyFieldsErr = true;
    } else if (emailEl.value === "") {
      createErr = true;
      emailErrText = "Required";
      emailEl.classList.add("mzp-c-field-control--error");
    } else if (checkEmail === false) {
      checkRules();
    }
  };

  const checkRules = () => {
    passwordErr = true;
    passwordEl.classList.add("mzp-c-field-control--error");
    passwordErrText = "Required";
    if (passwordEl) {
      passwordEl.value.length < minPasswordLength
        ? length.classList.add("rules-error")
        : null;

      passwordEl.value.match(lowerCaseLetters)
        ? letter.classList.add("clear")
        : letter.classList.add("rules-error");

      passwordEl.value.match(upperCaseLetters)
        ? capital.classList.add("clear")
        : capital.classList.add("rules-error");

      passwordEl.value.match(numbers)
        ? number.classList.add("clear")
        : number.classList.add("rules-error");
    }
    return;
  };

  const handleToggle = () => {
    passwordVisible = !passwordVisible;
    const type =
      passwordEl.getAttribute("type") === "password" ? "text" : "password";
    passwordEl.setAttribute("type", type);
  };

  const handleChange = (e) => {
    const name = e.srcElement.name;
    emailEl.classList.remove("mzp-c-field-control--error");
    emptyFieldsErr = false;
    createErr = false;
    passwordErr = false;

    letter.classList.remove("rules-error");
    capital.classList.remove("rules-error");
    number.classList.remove("rules-error");
    length.classList.remove("rules-error");

    if (passwordEl) {
      passwordEl.classList.remove("mzp-c-field-control--error");
      if (name === "id_user_pw") {
        inputItemsVisible = true;
        // Validate lowercase letters
        passwordEl.value.match(lowerCaseLetters)
          ? letter.classList.add("valid")
          : letter.classList.remove("valid");

        // Validate uppercase letters
        passwordEl.value.match(upperCaseLetters)
          ? capital.classList.add("valid")
          : capital.classList.remove("valid");

        // Validate numbers
        passwordEl.value.match(numbers)
          ? number.classList.add("valid")
          : number.classList.remove("valid");

        // Validate length
        passwordEl.value.length >= minPasswordLength
          ? length.classList.add("valid")
          : length.classList.remove("valid");

        if (
          passwordEl.value.length >= minPasswordLength &&
          passwordEl.value.match(numbers) &&
          passwordEl.value.match(lowerCaseLetters) &&
          passwordEl.value.match(upperCaseLetters)
        ) {
          checkEmail = true;
        } else checkEmail = false;
      }
    }
  };
</script>

<Meta
  title="Components/Cards/Create Account"
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

      <div class="card-content card-content--form" slot="card-content">
        <div class="form-wrapper">
          <form method="post" style={formStyles}>
            <fieldset class="mzp-c-field-set field-set">
              <div class="mzp-c-field field field--email">
                <div class="label-wrapper">
                  <label class="mzp-c-field-label" for="id_user_pw">Email</label
                  >
                </div>

                <input
                  class={inputEmailName}
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
                {#if createErr || emptyFieldsErr}
                  <p class="error-msg error-msg--email">
                    {emailErrText}
                  </p>
                {/if}
              </div>

              <!-- PASSWORD -->
              <div class="mzp-c-field field field--pw-create">
                <div class="label-wrapper">
                  <label class="mzp-c-field-label" for="id_user_pw"
                    >Password</label
                  >
                </div>

                <div class="input-wrapper">
                  <input
                    class={inputPWName}
                    bind:this={passwordEl}
                    on:change={handleChange}
                    on:keyup={handleChange}
                    id="id_user_pw"
                    name="id_user_pw"
                    type="password"
                    {pattern}
                    width="100%"
                  />
                  {#if passwordVisible}
                    <img
                      src="img/icon-password-hide.svg"
                      alt="Eye with slash across it"
                      class={`toggle-password ${
                        inputItemsVisible ? "create-show" : "create-hide"
                      }`}
                      id="hide-eye"
                      width="24px"
                      height="24px"
                      on:click|preventDefault={handleToggle}
                    />
                  {:else}
                    <img
                      src="img/icon-password-show.svg"
                      alt="Open eye"
                      class={`toggle-password ${
                        inputItemsVisible ? "create-show" : "create-hide"
                      }`}
                      id="show-eye"
                      width="24px"
                      height="24px"
                      on:click|preventDefault={handleToggle}
                    />
                  {/if}
                </div>

                {#if emptyFieldsErr || passwordErr}
                  <p class="error-msg error-msg--password">
                    {passwordErrText}
                  </p>
                {/if}

                <ul
                  class={`password-requirements ${
                    inputItemsVisible ? "create-show" : "create-hide"
                  }`}
                >
                  <li bind:this={length} id="length">
                    Use at least 8 characters
                  </li>
                  <li bind:this={capital} id="capital">
                    Use at least 1 uppercase letter
                  </li>
                  <li bind:this={letter} id="letter">
                    Use at least 1 lowercase letter
                  </li>
                  <li bind:this={number} id="number">Use at least 1 number</li>
                </ul>
              </div>
            </fieldset>
          </form>
          <Button
            on:click={checkFields}
            size="xl"
            customClass="card-button card-button--create"
          >
            <div class="card-button__text">{args.cta1}</div></Button
          >
          <p class="body-text-privacy">
            By proceeding, you agree to our <a href="/">Privacy Notice</a>
          </p>
        </div>
      </div>
      <!-- SIGN IN -->
      <p slot="cta" class="body-text-action">
        {args.bodyText} <button on:click={() => handleTrigger("welcome")}>{args.linkText}</button>
      </p>
    </Card>
  </div>
</Template>

<!-- 👇 Each story then reuses that template -->

<Story
  name="Create Account"
  args={{
    width: "370px",
    fontSize: "38px",
    height: "auto",
    title: "Create account",
    cta1: "Continue",
    bodyText: "Already have an account?",
    linkText: "Sign in",
    custom: "card-body-create",
    headerClass: "signin"
  }}
/>

<style>
  .sb-container {
    padding: 2rem 1rem;
  }
  .title-highlight {
    width: calc(var(--titleWidth) + 15px);
  }

  form {
    height: var(--formHeight);
  }

  .invalid-email {
    margin-top: -19px;
    padding-bottom: 10px;
  }
</style>
