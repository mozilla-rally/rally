<script type="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import type { AppStore } from "$lib/stores/types";

  const store: AppStore = getContext("rally:store");

  const dispatch = createEventDispatcher();

  let browser;

  onMount(async () => {
    if (window) {
      browser = window.location;
    }
  });

  let scrollY = 0;

  let showArrow = true;
  $: if (scrollY > 20) {
    showArrow = false;
  } else {
    showArrow = true;
  }

  let intro = false;

  const handleLogOut = async () => {
    await store.signOutUser();
    goto("/signup");
    browser.reload();
  };
</script>

<svelte:window bind:scrollY />

<div class="cta-wrapper">
  <Button btnID="accept" size="xl" product on:click={() => dispatch("accept")}>
    Accept & Enroll
  </Button>
  <Button
    size="xl"
    product
    secondary
    btnID="decline"
    on:click={() => {
      handleLogOut();
    }}
  >
    Decline
  </Button>
</div>
