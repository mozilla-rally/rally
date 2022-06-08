<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";

  import SideNav from "$lib/components/SideNav.svelte";
  import SettingsReadOnly from "$lib/views/account-settings/SettingsReadOnly.svelte";
  import SettingsCard from "$lib/views/account-settings/SettingsCard.svelte";

  import type { Readable } from "svelte/store";
  import type { AppStore } from "$lib/stores/types";
  import type { NotificationStore } from "$lib/components/notifications";

  const store: AppStore = getContext("rally:store");

  const isAuthenticated: Readable<boolean> = getContext(
    "rally:isAuthenticated"
  );
  const notifications: NotificationStore = getContext("rally:notifications");

  let siderListArr = [
    {
      title: "Manage Profile",
      type: "profile",
      href: "/profile",
      highlight: false,
      icon: "img/icon-profile.svg",
    },
    {
      title: "Account settings",
      type: "read-only",
      highlight: false,
      icon: "img/icon-gear.svg",
      sublistArr: [
        { type: "update-email", highlight: false, title: "Edit Email" },
        {
          type: "update-pw",
          highlight: false,
          title: "Edit Password",
        },
        { type: "delete", highlight: false, title: "Delete Account" },
      ],
    },
  ];

  let siderArgs = {
    width: "265px",
    clazz: "side-nav-settings",
    fontSize: "14px",
  };

  let screenOptions = {
    isEmail: false,
    isPW: false,
    isDelete: false,
    isReadOnly: false,
    isCheckEmail: false,
    isCheckEmailPW: false,
    isForgetPW: false,
  };

  let settingsTitle = "Account settings";
  let settingsDescription =
    "Manage your info, privacy, and security to make Rally work better for you.";
  let userProvider;
  let isGoogleOnlyAccount;
  let isUserVerified;
  let getEmailStatus;

  let cardArgs = {
    width: "486px",
    height: "auto",
    fontSize: "38px",
    customClass: "settings-update",
    headerClass: "settings-update",
  };

  let isReadOnlyArgs = {
    ...cardArgs,
    custom: "settings extra-padding is-read-only",
  };

  onMount(async () => {
    screenOptions = {
      ...screenOptions,
      isReadOnly: true,
    };
    userProvider = await store.getUserProvider();
    isGoogleOnlyAccount =
      userProvider &&
      userProvider.length &&
      !userProvider.some((p) => p.providerId === "password"); // no password provider means Google-only
  });

  const displayCard = (event) => {
    let value;

    if (event.detail) {
      value = event.detail.text;
    } else {
      value = event;
    }

    switch (value) {
      case "update-email":
        resetOptions();
        screenOptions = {
          ...screenOptions,
          isEmail: true,
        };
        settingsTitle = "Change your email address";
        break;
      case "update-pw":
        resetOptions();
        screenOptions = {
          ...screenOptions,
          isPW: true,
        };
        settingsTitle = "Change your password";
        break;
      case "delete":
        resetOptions();
        screenOptions = {
          ...screenOptions,
          isDelete: true,
        };
        settingsTitle = "Delete your Rally account";
        settingsDescription =
          "Thank you for helping make the Internet a little better";
        break;
      case "read-only":
        resetOptions();
        showReadOnly();
        break;
      case "check-email":
        resetOptions();
        screenOptions = {
          ...screenOptions,
          isCheckEmail: true,
        };
        break;
      case "check-email-pw":
        resetOptions();
        screenOptions = {
          ...screenOptions,
          isCheckEmailPW: true,
        };
        break;
      case "forget-pw":
        resetOptions();
        screenOptions = {
          ...screenOptions,
          isForgetPW: true,
        };
        break;
      default:
        break;
    }
  };

  const resetOptions = () => {
    screenOptions = {
      isEmail: false,
      isPW: false,
      isDelete: false,
      isReadOnly: false,
      isCheckEmail: false,
      isCheckEmailPW: false,
      isForgetPW: false,
    };
  };

  const showReadOnly = () => {
    screenOptions = {
      ...screenOptions,
      isReadOnly: true,
    };
    settingsTitle = "Account settings";
    settingsDescription =
      "Manage your info, privacy, and security to make Rally work better for you.";
  };

  const getLatestVerified = async () => {
    return (isUserVerified = await store.isUserVerified());
  };

  $: if ($store._initialized) {
    if (!$store?.user?.uid) {
      goto("/signup");
    } else if (!$store?.user?.enrolled) {
      goto("/welcome/terms");
    }
  }

  $: if (screenOptions.isReadOnly) {
    cardArgs = isReadOnlyArgs;
  }

  $: isUserVerified = getLatestVerified();
  $: getEmailStatus = localStorage.getItem("isEmailChange");
  $: if (isUserVerified === true && getEmailStatus) {
    notifications.send({ code: "SUCCESSFULLY_UPDATED_EMAIL" });
    localStorage.removeItem("isEmailChange");
  }
</script>

<svelte:head>
  <title>Account Settings | Mozilla Rally</title>
</svelte:head>

{#if $store._initialized && $isAuthenticated === true}
  <section
    in:fly={{ duration: 800, y: 5 }}
    class="container account-settings-container"
  >
    <div class="row">
      <div class="sider-nav col-12 col-md-4">
        <SideNav
          {isGoogleOnlyAccount}
          {...siderArgs}
          listArr={siderListArr}
          on:type={displayCard}
        />
      </div>

      <div class="account-settings col-12 col-lg-7">
        {#if screenOptions.isReadOnly}
          <div class="title-wrapper">
            <h2 class="section-header">{settingsTitle}</h2>
          </div>

          <p class="description">
            {settingsDescription}
          </p>
        {/if}

        <div class="account-settings-main">
          {#if screenOptions.isReadOnly}
            <SettingsReadOnly {displayCard} on:type={displayCard} />
          {/if}

          {#if !screenOptions.isReadOnly}
            <SettingsCard
              {...screenOptions}
              {cardArgs}
              {displayCard}
              {settingsTitle}
              {settingsDescription}
              on:type={displayCard}
            />
          {/if}
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  :global(.noise-background) {
    display: block !important;
  }

  .title-wrapper {
    display: flex;
  }

  .sider-nav {
    max-width: 265px;
    padding: 0;
  }

  .description {
    margin-bottom: 34px;
  }
</style>
