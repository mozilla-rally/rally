<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import niceDate from "./nice-date";

  export let endDate;

  let clazz;
  export { clazz as class };
</script>

<div>
  <slot name="study-top-section" />
</div>
<div class={`study-card-header grid ${clazz}`}>
  <slot name="study-icon">
    <img
      class="study-card-image"
      width="60"
      alt="study icon"
      src="img/default-study-icon.png"
    />
  </slot>
  <div class="study-card-header-info">
    <h3 class="text-head-sm">
      <slot name="study-name">Study</slot>
    </h3>
    <div class="study-card-author text-body-sm">
      by
      <slot name="study-author">author</slot>
      {#if endDate}
        | Ends:
        {niceDate(endDate)}
      {/if}
    </div>
  </div>
  <div class="study-cta">
    <slot name="study-cta" />
  </div>
</div>

<style>
  .study-card-header {
    display: grid;
    padding: 24px;
    grid-gap: 24px;
    grid-template-columns: var(--study-card-header-columns);
  }

  @media (max-width: 480px) {
    .study-card-header {
      grid-template-columns: var(--study-card-image-size) auto;
      grid-template-rows: auto auto max-content;
      grid-row-gap: 12px;
      padding-bottom: 0px;
    }

    .study-cta {
      grid-row: 2;
      grid-column: 1 / span 2;
    }
  }

  .study-card-header-info {
    margin-top: 8px;
  }

  .study-card-author {
    /* explicitly set this field to prevent Zilla in some contexts */
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    color: var(--color-marketing-gray-70);
  }

  h3 {
    margin: 0;
    grid-area: title;
    width: 100%;
    margin-bottom: 2px;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }
</style>
