<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { slide } from "svelte/transition";
  import AccordionButton from "./AccordionButton.svelte";

  export let revealed = false;
</script>

<AccordionButton bind:revealed>
  <slot name="title">expand</slot>
</AccordionButton>

<div
  transition:slide={{ duration: 200 }}
  class={`expanded-content ${revealed ? "h-auto" : "invisible"}`}
  style={!revealed ? "height: 0px; margin: 0; padding: 0" : ""}
>
  <slot />
</div>

<style>
  .expanded-content {
    box-sizing: border-box;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
</style>
