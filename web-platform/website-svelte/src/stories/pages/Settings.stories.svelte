<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import ContentContainer from "../../lib/layouts/main/ContentContainer.svelte";
  import Footer from "../../lib/layouts/main/Footer.svelte";
  import StorySettingsCard from "../components/account/StorySettingsCard.svelte";
  import StorySettingsReadOnly from "../components/account/StorySettingsReadOnly.svelte";

  const listArr = [
    { email: "update-email" },
    { password: "update-pw" },
    { leaveRally: "leave-rally" },
  ];

  let isEmail = false;
  let isPW = false;
  let isLeaveRally = false;
  let isReadOnly = true;
  let settingsTitle = "Account Settings";
  let settingsDecription =
    "Manage your info, privacy, and security to make Rally work better for you.";

  let cardArgs = {
    width: "700px",
    height: "auto",
    fontSize: "38px",
  };

  let updateEmailArgs = {
    ...cardArgs,
    custom: "settings",
  };

  let updatePWArgs = {
    ...cardArgs,
    custom: "settings",
  };

  let leaveRallyArgs = {
    ...cardArgs,
    custom: "settings extra-padding",
  };

  let isReadOnlyArgs = {
    ...cardArgs,
    custom: "settings extra-padding is-read-only",
  };

  const displayCard = (event) => {
    switch (event.detail.text) {
      case "update-email":
        isEmail = true;
        isPW = false;
        isLeaveRally = false;
        isReadOnly = false;
        settingsTitle = "Update email";
        break;
      case "update-pw":
        isPW = true;
        isEmail = false;
        isLeaveRally = false;
        settingsTitle = "Update password";
        isReadOnly = false;
        break;
      case "leave-rally":
        isLeaveRally = true;
        isEmail = false;
        isPW = false;
        isReadOnly = false;
        settingsTitle = "Leave Rally";
        break;
      case "read-only":
        showReadOnly();
        break;
      default:
        break;
    }
  };

  const showReadOnly = () => {
    isReadOnly = true;
    isLeaveRally = false;
    isEmail = false;
    isPW = false;
    settingsTitle = "Account Settings";
    let settingsDecription =
      "Manage your info, privacy, and security to make Rally work better for you.";
  };

  $: if (isReadOnly) {
    cardArgs = isReadOnlyArgs;
  } else if (isEmail) {
    cardArgs = updateEmailArgs;
  } else if (isPW) {
    cardArgs = updatePWArgs;
  } else if (isLeaveRally) {
    cardArgs = leaveRallyArgs;
  }
</script>

<!-- until new designs for account is up, will comment this out as a placeholder   -->
<!-- 
<Meta
  title="Pages/Account"
  component={ContentContainer}
  argTypes={{
    width: { control: "text" },
    fontSize: { control: "text" },
    custom: { control: "text" },
  }}
/>

<Template let:args>
  <StoryNavbar />
  <div class="account-settings-container">
    <div class="title-wrapper">
      {#if !isReadOnly}
        <button class="arrow-btn" on:click={showReadOnly}>
          <img class="back-arrow" alt="back arrow" src="/img/Back.svg" />
        </button>
      {/if}
      <h2 class="section-header">{settingsTitle}</h2>
    </div>

    {#if isReadOnly}
      <p class="description">
        Manage your info, privacy, and security to make Rally work better for
        you.
      </p>
    {/if}
    <hr />
    <div class="account-settings-main">
      {#if isReadOnly}
        <StorySettingsReadOnly on:type={displayCard} {listArr} />
      {/if}

      {#if !isReadOnly}
        <StorySettingsCard
          {isEmail}
          {isPW}
          {is2FA}
          {cardArgs}
          {displayCard}
          on:type={displayCard}
        />
      {/if}
    </div>
  </div>
</Template>

<Story
  name="Account"
  args={{
    width: "214px",
    fontSize: "1rem",
    custom: "account-settings",
  }}
/>

<style>
  .title-wrapper h2{
    font-size: 38px; 
    font-family: "Zilla Slab", Inter, X-LocaleSpecific, sans-serif;
  }
</style> -->
