<script lang="ts">
  import { getContext } from "svelte";
  import { goto } from "$app/navigation";

  import type { Readable } from "svelte/store";
  import type { AppStore } from "$lib/stores/types";

  const store: AppStore = getContext("rally:store");
  const isAuthenticated: Readable<boolean> = getContext(
    "rally:isAuthenticated"
  );

  isAuthenticated.subscribe((state) => {
    if (state === false) {
      goto("/signup");
      localStorage.removeItem("isLoading");
    }
  });

  $: if ($isAuthenticated !== undefined && $store._initialized) {
    if (!$store?.user?.uid) {
      goto("/signup");
      localStorage.removeItem("isLoading");
    } else if (!$store?.user?.enrolled) {
      goto("/welcome/terms");
    }else{
      goto ("/studies")
    }
  }
</script>
