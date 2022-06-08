<script lang="ts">
  import { getContext } from "svelte";
  import { goto } from "$app/navigation";
  import TermsContent from "$lib/views/terms/Content.svelte";
  import TermsCallToAction from "./_TermsCallToAction.svelte";

  import type { Readable } from "svelte/store";
  import type { AppStore } from "$lib/stores/types";
  const store: AppStore = getContext("rally:store");
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

<TermsContent />
<TermsCallToAction
  on:accept={async () => {
    await store.updatePlatformEnrollment(true);
    goto("/welcome/profile");
  }}
/>
