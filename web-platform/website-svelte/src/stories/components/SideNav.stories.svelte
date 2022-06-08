<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import SideNav from "../../lib/components/SideNav.svelte";

  let siderListArr = [
    {
      title: "Manage Profile",
      type: "profile",
      highlight: false,
      icon: "img/icon-profile.svg",
    },
    {
      title: "Account settings",
      type: "settings",
      highlight: false,
      icon: "img/icon-gear.svg",
      sublistArr: [
        { type: "email", highlight: false, title: "Edit Email" },
        {
          type: "password",
          highlight: false,
          title: "Edit Password",
        },
        { type: "delete", highlight: false, title: "Delete Account" },
      ],
    },
  ];
</script>

<Meta
  title="Components/Layout/SideNav"
  component={SideNav}
  argTypes={{
    width: { control: "text" },
    clazz: { control: "text" },
    fontSize: { control: "text" },
  }}
/>

<!-- 👇 We create a “template” of how args map to rendering -->
<Template let:args>
  <div class="sb-container">
    <SideNav
      width={args.width}
      clazz={args.clazz}
      fontSize={args.fontSize}
      listArr={siderListArr}
    />
  </div>
</Template>

<!-- 👇 Each story then reuses that template -->
<Story
  name="Setting Side Nav"
  args={{
    width: "265px",
    clazz: "sidenav",
    fontSize: "14px",
  }}
/>

<style>
  .sb-container {
    padding: 2rem 1rem;
  }
</style>
