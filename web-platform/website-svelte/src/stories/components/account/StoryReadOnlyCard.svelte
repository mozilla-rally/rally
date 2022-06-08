<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  export let title;
  export let content;
  export let custom = "";
  import arrowheadright from "./arrowhead-right.svg"

  $: classSet = ["read-only-card-body", custom].filter((t) => t).join(" ");

  const key = `read-only-card-${
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  }`;
</script>

<div id={key}>
  <div class="read-only-card-container radius-sm">
    <div class="read-only-card--left">
      <header class="read-only-card-header">
        <h2 class="card-header__title mzp-c-card-title">
          <div class="card-header__text">{title}</div>
        </h2>
      </header>

      <div class={classSet}>
        <p class="card-body__content">{content}</p>
      </div>
    </div>

    <div class="read-only-card--right">
      <img class="read-only__arrow" src={arrowheadright} alt="right arrow" />
    </div>
  </div>
</div>

<style>
  header {
    display: grid;
    grid-template-columns: auto max-content;
  }

  h2 {
    font-size: var(--fontSize);
  }
</style>
