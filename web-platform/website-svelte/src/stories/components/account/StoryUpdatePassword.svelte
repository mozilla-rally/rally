<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import Button from "../../../lib/components/Button.svelte";


 
  let btnDisabled = true;
  let password;
  let passwordEl;
  let password2;
  let passwordEl2;
  let password3;
  let passwordEl3;
  let capital;
  let number;
  let length;
  let letter;
  let passwordVisible = false;
  const minPasswordLength = 8;
  let pattern = "(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}";



  const handleChange = (e) => {
    const name = e.srcElement.name;
    if (passwordEl2) {
      // Validate lowercase letters
      let lowerCaseLetters = /[a-z]/g;
      passwordEl2.value.match(lowerCaseLetters)
        ? letter.classList.add("valid")
        : letter.classList.remove("valid");

      // Validate uppercase letters
      let upperCaseLetters = /[A-Z]/g;
      passwordEl2.value.match(upperCaseLetters)
        ? capital.classList.add("valid")
        : capital.classList.remove("valid");

      // Validate numbers
      let numbers = /[0-9]/g;
      passwordEl2.value.match(numbers)
        ? number.classList.add("valid")
        : number.classList.remove("valid");

      // Validate length
      passwordEl2.value.length >= 8
        ? length.classList.add("valid")
        : length.classList.remove("valid");

      if (name === "id_user_pw") {
        if (
          password2.length >= minPasswordLength &&
          passwordEl2.value.match(numbers) &&
          passwordEl2.value.match(lowerCaseLetters) &&
          passwordEl2.value.match(upperCaseLetters)
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

<div class="reset-wrapper">
  <p class="card-description">Change your current password.</p>
  <div class="card-body-content">
    <form method="post">
      <fieldset class="mzp-c-field-set field-set-settings">
        <div class="mzp-c-field field-pw">
          <div class="label-wrapper">
            <label class="mzp-c-field-label enter-pw" for="id_user_pw"
              >Enter your old password</label
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

          <div class="label-wrapper">
            <label class="mzp-c-field-label enter-pw" for="id_user_pw"
              >Enter your new password</label
            >
          </div>
          <div class="input-wrapper">
            <input
              class="mzp-c-field-control"
              bind:value={password2}
              bind:this={passwordEl2}
              on:change={handleChange}
              on:keyup={handleChange}
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

          <p class="info-msg-active-reset">
            Your password should be unique and must contain:
          </p>
          <ul class="info-rules">
            <li bind:this={length} id="length" class="invalid">
              At least 8 characters
            </li>
            <li bind:this={letter} id="letter" class="invalid">
              At least 1 lowercase letter
            </li>
            <li bind:this={capital} id="capital">
              At least 1 uppercase letter
            </li>
            <li bind:this={number} id="number" class="invalid">
              At least 1 number
            </li>
          </ul>

          <div class="label-wrapper">
            <label class="mzp-c-field-label enter-pw" for="id_user_pw"
              >Confirm your new password</label
            >
          </div>
          <div class="input-wrapper">
            <input
              class="mzp-c-field-control"
              bind:value={password3}
              bind:this={passwordEl3}
              on:change={handleChange}
              on:keyup={handleChange}
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
        </div>
      </fieldset>
    </form>
    <Button disabled={btnDisabled} size="xl" customClass="card-button create btn-settings">
      <div class="button-text">Update passsord</div></Button
    >
  </div>
</div>

<style>
  form {
    height: auto;
  }

  .input-wrapper{
    margin-bottom: 30px;
  }
  
  .card-description{
    padding-bottom: 20px; 
    width: 80%;
    font-size: 18px;
  }

  .info-msg-active-reset {
    text-align: left;
    font-size: 12px;
    color: gray;
  }

  .info-rules {
    margin-bottom: 15px;
  }
</style>
