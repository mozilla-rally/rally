<script lang="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import Card from "../../../lib/components/Card.svelte";
  import UpdatePassword from "./StoryUpdatePassword.svelte";
  import UpdateEmail from "./UpdateEmail.svelte";
  import "../css/RallySettings.css";

  export let isEmail;
  export let isPW;
  export let cardArgs;
  export let displayCard;
</script>

<Card {...cardArgs}>
  <div class="card-body-content" slot="card-body">
    {#if isEmail}
      <UpdateEmail on:type={displayCard} />
    {/if}

    {#if isPW}
      <UpdatePassword on:type={displayCard} />
    {/if}
  </div>
</Card>
