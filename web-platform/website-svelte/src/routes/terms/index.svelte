<script lang="ts">
  import { getContext } from "svelte";
  import { goto } from "$app/navigation";
  import TermsContent from "$lib/views/terms/Content.svelte";

  import type { Readable } from "svelte/store";
  const isAuthenticated: Readable<boolean> = getContext(
    "rally:isAuthenticated"
  );

  $: if ($isAuthenticated === false) {
    goto("/signup");
  }
</script>

<svelte:head>
  <title>Privacy Policy | Mozilla Rally</title>
</svelte:head>

{#if $isAuthenticated}
  <TermsContent />
{/if}
