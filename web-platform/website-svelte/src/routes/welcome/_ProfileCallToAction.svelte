<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import Arrow02 from "$lib/components/Arrow02.svelte";
  import Button from "$lib/components/Button.svelte";

  const dispatch = createEventDispatcher();

  let scrollY = 0;

  let showArrow = true;
  $: if (scrollY > 20) {
    showArrow = false;
  } else {
    showArrow = true;
  }

  let intro = false;
</script>

<svelte:window bind:scrollY />

<div class="cta-wrapper">
  <Button btnID="save" size="xl" product on:click={() => dispatch("save")}>
    Save & Continue
  </Button>
  <Button
    btnID="skip"
    size="xl"
    product
    secondary
    on:click={() => dispatch("skip")}
  >
    Skip for Now
  </Button>
  {#if showArrow && intro}
    <div
      transition:fade|local={{ duration: 400 }}
      class="shortcut-callout"
      style="text-align: right;"
    >
      the following 7<br /> questions are optional
    </div>
    <div class="arrow">
      <Arrow02 />
    </div>
  {/if}
</div>

<style>
  .arrow {
    width: 0;
    height: 0;
    display: inline-block;
    transform: translateY(-129px);
  }
</style>
