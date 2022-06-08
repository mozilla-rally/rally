<script type="ts">
  import { getContext } from "svelte";
  import type { AppStore } from "$lib/stores/types";
  const store: AppStore = getContext("rally:store");

  export let handleLogOut;
  export let clazz;
  export let toggleNavIcon;
  export let mobileVisible

  let userEmail;

  const getLatestUserEmail = async () => {
    return (userEmail = await store.getUserEmail());
  };

  $: userEmail = getLatestUserEmail();

</script>

<ul class={`dropdown-list dropdown-list--${clazz} dropdown-list--${clazz}__${mobileVisible ? "show" : "hide"}`}>
  <li
    class={`dropdown-list__item dropdown-list__item--top dropdown-list__item--${clazz}-top`}
  >
    <div
      class={`list-item list-item--top list-item--${clazz}-top d-flex align-items-center`}
    >
      <p class="list-item--email">{userEmail}</p>
    </div>
  </li>
  <hr />
  <li
    on:click={toggleNavIcon}
    class={`dropdown-list__item dropdown-list__item--title dropdown-list__item--${clazz}`}
  >
    <div class={`list-item list-item--title list-item--${clazz}`}>
      Your Rally account
    </div>
  </li>
  <li
    on:click={toggleNavIcon}
    class={`dropdown-list__item dropdown-list__item--${clazz}`}
  >
    <a
      class={`list-item list-item--profile list-item--${clazz}`}
      href="/profile"
    >
      <div class="list-item__text">Manage Profile</div>
    </a>
  </li>
  <li
    on:click={toggleNavIcon}
    class={`dropdown-list__item dropdown-list__item--${clazz}`}
  >
    <a
      class={`list-item list-item--studies list-item--${clazz}`}
      href="/studies"
    >
      <div class="list-item__text">Studies</div></a
    >
  </li>
  <li
    on:click={toggleNavIcon}
    class={`dropdown-list__item dropdown-list__item--${clazz}`}
  >
    <a
      class={`list-item list-item--settings list-item--${clazz}`}
      href="/account-settings"
    >
      <div class="list-item__text">Account settings</div></a
    >
  </li>
  <li class={`dropdown-list__item dropdown-list__item--${clazz}`}>
    <button
      on:click|preventDefault={handleLogOut}
      class={`list-item list-item--quit ist-item--${clazz}`}
    >
      <div class="list-item__text">Sign out</div></button
    >
  </li>
  <hr />
  <li class={`dropdown-list__title dropdown-list__${clazz}`}>
    <div class="list-item list-item--title">Get help</div>
  </li>

  <li
    on:click={toggleNavIcon}
    class={`dropdown-list__item dropdown-list__item--${clazz}`}
  >
    <a
      class={`list-item list-item--studies list-item--${clazz}`}
      href="https://support.mozilla.org/en-US/kb/about-mozilla-rally"
      target="_blank"
    >
      Support</a
    >
  </li>
  <li
    on:click={toggleNavIcon}
    class={`dropdown-list__item dropdown-list__${clazz}`}
  >
    <a
      href="__BASE_SITE__/how-rally-works/faqs/"
      class={`list-item list-item--settings list-item--${clazz}`}
      target="_blank"
    >
      <div class="list-item__text">FAQ</div></a
    >
  </li>
  <hr />
  <li
    on:click={toggleNavIcon}
    class={`dropdown-list__item dropdown-list__item--bottom dropdown-list__item--${clazz}`}
  >
    <a
      href="__BASE_SITE__/how-rally-works/data-and-privacy/"
      class={`list-item list-item--bottom list-item--${clazz} d-flex align-items-center justify-content-center`}
      target="_blank"
    >
      <div>Data & Privacy</div>
    </a>
  </li>
</ul>

<style>
  .list-item--quit{
    width: 100%;
  }
  .list-item--email{
    word-break: break-all;
  }
  .dropdown-list--mobile__show{
    display: block;
  }

  .dropdown-list--mobile__hide{
    display: none;
  }
</style>