<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { onMount } from "svelte";
  export let transparent = false;

  let scrollY = 0;
  let innerHeight = 0;
  let bodyHeight = 0;

  onMount(() => {
    bodyHeight = document.body.clientHeight;
    // observe ANY resizes of the browser window, the view port,
    // or whatever, and update the bodyHeight accordingly.
    const resizer = new ResizeObserver(([e]) => {
      bodyHeight = e.contentRect.height;
    });
    resizer.observe(document.body);
  });

  let PX_OFFSET = 130;

  $: gradient = Math.min(1, (bodyHeight - (scrollY + innerHeight)) / PX_OFFSET);

  $: style = transparent
    ? `--background: none`
    : `
--background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(249, 249, 251, ${gradient}) 45%
  );
`;
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div class="onboarding-cta-container" {style}>
  <div class="onboarding-cta-inner">
    <slot />
  </div>
</div>

<style>
  .onboarding-cta-container {
    margin-bottom: 40px;
  }
</style>
