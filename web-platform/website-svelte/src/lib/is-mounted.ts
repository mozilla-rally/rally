import { onMount } from "svelte";
import { writable } from "svelte/store";

export default function mountable() {
  const { subscribe, set } = writable(false);

  onMount(() => {
    set(true);
  });

  return { subscribe };
}
