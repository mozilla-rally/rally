<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  export let width;
  export let height;
  export let headerClass="";
  export let customClass="";

  function toVariable(key, value) {
    return value ? `${key}: ${value};` : undefined;
  }
  function addStyleVariables({ width, height }) {
    const values = [
      toVariable("--width", width),
      toVariable("--height", height),
    ].filter((d) => d !== undefined);
    if (values.length === 0) return undefined;
    return values.join("; ");
  }

  $:styles = addStyleVariables({
    width,
    height,
  });
  $: classSet = [customClass].filter((t) => t).join(" ");

  const key = `card-${
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  }`;
</script>

<div id={key} class={`card radius-sm card--${customClass}`} style={styles}>
  <div class={`card__inner card__inner--${customClass}`}>
    <header class={`card-header card-header--${headerClass}`}>
      <slot name="card-title" />
    </header>

    <div class={`card__body card__body--${classSet}`}>
      <slot name="card-content">
        <p>I am a Card</p>
      </slot>
    </div>

    <div class="card__cta">
      <slot name="cta" />
    </div>
  </div>
</div>

<style>
  .card {
    max-width: var(--width);
    height: var(--height);
    background-color: #fff;
  }

  header {
    max-width: var(--width);
  }
</style>
