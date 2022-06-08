<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import Card from "../../../lib/components/Card.svelte";

  export let width;
  export let title;
  export let height;
  export let customClass;
  export let headerClass;
  export let displayCard;
</script>

<div class="settings-delete">
  <Card {width} {height} {customClass} {headerClass}>
    <h2 class="title-wrapper title-wrapper--settings" slot="card-title">
      <div class="title-text title-text--settings">{title}</div>
    </h2>
    <div class="card-content card-content--settings" slot="card-content">
      <div class="content-box">
        <div class="content-box__info">
          <div class="content-box__description">
            This account will no longer be available, and all your saved data
            will be permanently deleted.
          </div>
          <button
            on:click={() => {
              displayCard("delete");
            }}
            class="edit-btn rwp-link">Delete</button
          >
        </div>
      </div>
    </div>
  </Card>
</div>

<style>
  .settings-delete {
    margin-top: 16px;
  }
</style>
