<script lang="ts">
  import { getContext } from "svelte";
  import { goto } from "$app/navigation";
  import ProfileContent from "$lib/views/profile/Content.svelte";
  import ProfileCallToAction from "./_ProfileCallToAction.svelte";

  import type { Readable } from "svelte/store";
  import type { AppStore } from "$lib/stores/types";
  const store: AppStore = getContext("rally:store");
  const isAuthenticated: Readable<boolean> = getContext(
    "rally:isAuthenticated"
  );

  $: if ($isAuthenticated === false) {
    goto("/signup");
  } else if ($isAuthenticated === true && $store?.user?.onboarded) {
    goto("/studies");
  }

  let formattedResults;

  function onAction(saveData = false) {
    return async () => {
      if (saveData) {
        await store.updateDemographicSurvey(formattedResults);
      }
      await store.updateOnboardedStatus(true);
      goto("/studies");
    };
  }
</script>

<svelte:head>
  <title>Tell Us About Yourself | Mozilla Rally</title>
</svelte:head>

{#if $store._initialized && !$store?.user?.onboarded}
  <ProfileContent bind:formattedResults />

  <ProfileCallToAction on:save={onAction(true)} on:skip={onAction(false)} />
{/if}
