<script lang="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import Button from "../../../lib/components/Button.svelte";
  import ReadOnlyCard from "./StoryReadOnlyCard.svelte";
  import { onMount, createEventDispatcher } from "svelte";
  import isMounted from "../../../lib/is-mounted";

  const dispatch = createEventDispatcher();

  export let settingsList;
  let leaveModal = false;
  let Dialog;
  let userEmail = "test@example.com";
  onMount(async () => {
    Dialog = (await import("../../../lib/components/Dialog.svelte")).default;
  });

  const mounted = isMounted();

  const handleSelect = (type) => {
    dispatch("type", {
      text: type,
    });
  };
</script>

<di
  on:leave-rally={() => {
    leaveModal = true;
  }}
  class="settings-readonly"
>
  <div class="settings-readonly--first">
    <h3 class="readonly-title">Contact Info</h3>
    <div
      class="readonly-email"
      on:click={() => {
        handleSelect(settingsList["email"]);
      }}
    >
      <ReadOnlyCard title="Email Address" content={userEmail} />
    </div>
  </div>

  <div class="settings-readonly--second">
    <h3 class="readonly-title">Account Security</h3>
    <div
      class="readonly-pw"
      on:click={() => {
        handleSelect(settingsList["password"]);
      }}
    >
      <ReadOnlyCard title="Password" content="*************" />
    </div>
  </div>

  <div class="settings-readonly--leave">
    <Button
      on:click={() => {
        leaveModal = true;
      }}
      size="lg"
      customControl={true}
      textColor="#c50042"
      background="transparent"
      borderColor="#c50042">Leave Mozilla Rally</Button
    >
  </div>

</di>
