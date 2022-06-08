<script type="ts">
  import { onMount, getContext } from "svelte";
  import { fly } from "svelte/transition";
  import RallyNavbar from "$lib/layouts/main/Navbar.svelte";
  import ExternalLink from "$lib/components/icons/ExternalLink.svelte";
  import Dropdown from "./_Dropdown.svelte";
  import isMounted from "$lib/is-mounted";
  import type { AppStore } from "$lib/stores/types";

  const store: AppStore = getContext("rally:store");
  const mounted = isMounted();

  let browser;
  let isFocused = false;
  let ariaExpanded = false;
  let ariaHidden = true;
  let dropDownVisible = false;
  let mobileVisible = false;
  let dropDownEl;
  let display = "none";
  let onDefault = false;

  onMount(async () => {
    if (window) {
      browser = window.location;
    }

    if (!onDefault) {
      if (dropDownEl) {
        display = "none";
      }
    }
  });

  const toggleDropdown = () => {
    dropDownVisible = !dropDownVisible;
  };

  const onFocus = () => (isFocused = true);

  const waitForAnimationEnd = () => {
    if (dropDownEl) {
      dropDownEl.addEventListener("animationend", () => {
        display = "none";
      });
    }
  };

  const waitForAnimationStart = () => {
    if (dropDownEl) {
      dropDownEl.addEventListener("animationend", () => {
        display = "show";
      });
    }
  };

  const handleLogOut = async () => {
    await store.signOutUser();
    browser.reload();
  };

  const toggleNavIcon = () => {
    mobileVisible = !mobileVisible;
    ariaExpanded = !ariaExpanded;
    ariaHidden = !ariaHidden;
  };

  $: dropDownVisible ? (display = "show") : (display = "hide");
  $: !dropDownVisible ? waitForAnimationEnd() : waitForAnimationStart();
</script>

<RallyNavbar>
  <div class="top-nav-left" slot="top-nav-left">
    <div class="header__logo">
      <!-- rally logo -->
      <a class="header__logo-link" href="/" alt="">
        {#if $mounted}
          <img
            in:fly={{ duration: 800, x: -15 }}
            src="img/moz-rally-logo.svg"
            alt="Mozilla Rally Logo"
          />
        {/if}
      </a>
    </div>

    <div class="header__primary-nav">
      <ul class="primary-nav d-flex align-items-center">
        <li
          class="primary-nav__item"
          in:fly={{ duration: 800, delay: 200, x: -15 }}
        >
          <a
            href="/studies"
            class="nav-link nav-link--studies"
            sveltekit:prefetch>Current Studies</a
          >
        </li>
        <li
          class="primary-nav__item"
          in:fly={{ duration: 800, delay: 200, x: -15 }}
        >
          <a
            href="https://support.mozilla.org/en-US/kb/about-mozilla-rally"
            class="nav-link nav-link--support d-flex justify-content-between align-items-center"
            target="_blank">Support <ExternalLink /></a
          >
        </li>
      </ul>
    </div>
  </div>

  <!-- Mobile nav toggle-->
  <button
    on:click={toggleNavIcon}
    class="header__nav-toggle"
    type="button"
    data-expands="mobile-nav"
    data-expands-height
    aria-expanded={ariaExpanded}
    slot="toggle"
  >
    <span class="header__nav-toggle-icon" />
    <span class="is-active-hide" aria-label="Open navigation menu." />
    <span class="is-active-show" aria-label="Close navigation menu." />
  </button>

  <div
    on:focus={onFocus}
    class="header__dropdown"
    data-expands="drop-nav"
    data-expands-height
    aria-expanded={ariaExpanded}
    slot="user-icon"
  >
    <div on:click={toggleDropdown} class="dropdown__user-icon">
      <img class="user-icon__img" src="img/icon-profile.svg" alt="user icon" />
    </div>

    <!-- DESKTOP Dropdown-->
    <div
      class={`dropdown-wrapper dropdown-wrapper--${display}`}
      bind:this={dropDownEl}
      on:mouseenter={() => (dropDownVisible = true)}
      on:mouseleave={() => (dropDownVisible = false)}
    >
      <Dropdown
        clazz="desktop"
        {toggleNavIcon}
        {handleLogOut}
        mobileVisible={false}
      />
    </div>
  </div>

  <!-- Mobile menu dropdown -->
  <div
    id="mobile-nav"
    class="header__mobile-menu"
    aria-hidden={ariaHidden}
    slot="mobile-nav"
  >
    <nav
      bind:this={dropDownEl}
      class="nav-mobile"
      aria-label="Primary navigation"
    >
      <Dropdown clazz="mobile" {mobileVisible} {toggleNavIcon} {handleLogOut} />
    </nav>
  </div>
</RallyNavbar>

<style>
  .top-nav-left {
    display: flex;
    justify-content: space-between;
    max-width: 580px;
    width: 100%;
  }
  .top-nav-left a:hover {
    text-decoration: underline;
  }
  .header__mobile-menu {
    max-height: 450px;
    height: 100%;
  }
  .dropdown__user-icon:hover {
    background-color: #ededf0;
    border-radius: 50%;
  }
</style>
