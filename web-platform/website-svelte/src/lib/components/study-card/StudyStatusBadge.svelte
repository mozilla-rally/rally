<script lang="ts">
  import CheckCircle from "../icons/CheckCircle.svelte";
  import Exclaimation from "../icons/Exclaimation.svelte";

  export let joined;
  export let connected;
  export let downloadUrl;
</script>

<div class="status-container">
  <span style="margin-right: 5px" class="d-flex">
    {#if joined && connected}
      <CheckCircle size="20px" color="var(--color-green-60)" />
    {:else}
      <Exclaimation size="20px" color="#FFA436" />
    {/if}
  </span>
  {#if joined && connected}
    <span class="text-body-sm connected title">You're participating</span>
  {:else}
    <span class="text-body-sm not-connected title"
      >You're not participating yet.
      {#if !connected}
        <a href={downloadUrl} target="_blank"
          >Add this study extension from the Chrome store.</a
        >
      {/if}
    </span>
  {/if}
</div>

<style>
  .status-container {
    display: flex;
    align-items: center;
  }

  @media (max-width: 480px) {
    .status-container {
      align-items: flex-start;
    }
  }

  .status-container .not-connected.title {
    color: #5e5e72;
  }

  .status-container .not-connected a {
    color: var(--color-blue-50);
    font-weight: 700;
    white-space: nowrap;
  }
</style>
