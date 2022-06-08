<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import RallyNavbar from "../../lib/layouts/main/Navbar.svelte";
  import { fly } from "svelte/transition";
  import isMounted from "../../lib/is-mounted";
  import ExternalLink from "../../lib/components/icons/ExternalLink.svelte";
  const mounted = isMounted();

  let browser;
  let userEmail;
  let dropdownList;
  let isFocused = false;
  let ariaExpanded = false;
  let ariaHidden = true;
  let isOpaque = false;
  let navOpacity = 0;

  const showDropdown = () => (dropdownList.style.display = "block");
  const hideDropdown = () => (dropdownList.style.display = "none");
  const onFocus = () => (isFocused = true);

  const checkOpacity = () => {
    isOpaque ? (navOpacity = 1) : (navOpacity = 0);
  };

  const toggleNavIcon = () => {
    ariaExpanded = !ariaExpanded;
    ariaHidden = !ariaHidden;
    isOpaque = !isOpaque;
    checkOpacity();
  };

  $: cssVarStyles = `--nav-opacity:${navOpacity}`;
</script>

<Meta title="Components/Layout/RallyNavbar" component={RallyNavbar} />

<Template>
  <RallyNavbar>
    <div class="header__logo" slot="logo-nav">
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

    <!-- Dropdown -->
    <div
      on:focus={onFocus}
      on:mouseover={showDropdown}
      class="header__dropdown"
      slot="user-icon"
    >
      <div class="dropdown__user-icon">
        <img src="img/user-solid.svg" alt="user icon" />
      </div>

      <ul
        on:mouseleave={hideDropdown}
        bind:this={dropdownList}
        class="dropdown-list"
      >
        <li class="dropdown-list__item">
          <div class="list-item--info">
            <p>Signed in as</p>
            <p class="text-bold">test@test.com</p>
          </div>
        </li>
        <hr />
        <li class="dropdown-list__item">
          <a class="list-item list-item--profile" href="/">
            <img src="img/user-138.svg" alt="settings icon" />
            <div class="list-item__text">Manage Profile</div>
          </a>
        </li>
        <li class="dropdown-list__item">
          <a class="list-item list-item--studies" href="/">
            <img src="img/reader-mode.svg" alt="settings icon" />
            <div class="list-item__text">Studies</div></a
          >
        </li>
        <li class="dropdown-list__item">
          <a class="list-item list-item--settings" href="/">
            <img src="img/settings.svg" alt="settings icon" />
            <div class="list-item__text">Account Settings</div></a
          >
        </li>
        <li class="dropdown-list__item">
          <button
            class="list-item list-item--quit"
          >
            <img src="img/quit.svg" alt="quit icon" />
            <div class="list-item__text">Sign Out</div></button
          >
        </li>
      </ul>
    </div>

    <!-- Mobile menu dropdown -->
    <div
      id="mobile-menu"
      class="header__mobile-menu"
      aria-hidden={ariaHidden}
      style={cssVarStyles}
      slot="mobile-nav"
    >
      <nav class="nav-mobile" aria-label="Primary navigation">
        <ul class="dropdown-list">
          <li class="dropdown-list__item info">
            <div class="dropdown-list__content dropdown-list--info">
              <div>Signed in as <span class="text-bold">test@test.com</span></div>
            </div>
          </li>
          <li class="dropdown-list__item">
            <a
              class="dropdown-list__content dropdown-list--profile"
              href="/"
            >
              <img src="img/user-138.svg" alt="settings icon" />
              <div class="list-item__text">Manage Profile</div>
            </a>
          </li>
          <li class="dropdown-list__item">
            <a
              class="dropdown-list__content dropdown-list--studies"
              href="/"
            >
              <img src="img/reader-mode.svg" alt="settings icon" />
              <div class="list-item__text">Studies</div></a
            >
          </li>
          <li class="dropdown-list__item">
            <a
              class="dropdown-list__content dropdown-list--settings"
              href="/"
            >
              <img src="img/settings.svg" alt="settings icon" />
              <div class="list-item__text">Account Settings</div></a
            >
          </li>
          <li class="dropdown-list__item">
            <button class="dropdown-list__content dropdown-list--quit">
              <img src="img/quit.svg" alt="quit icon" />
              <div class="list-item__text">Sign Out</div></button
            >
          </li>
        </ul>
      </nav>
    </div>
  </RallyNavbar>
</Template>

<Story name="RallyNavbar" />
