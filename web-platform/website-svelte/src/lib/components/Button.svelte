<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { get_current_component as getComponent } from "svelte/internal";
  import { forwardEvents } from "../forwardEvents";
  // TODO: once this PR lands, let's refactor this
  // to have (1) a size prop and (2) a variant prop.
  // variant can be a string or array of strings.
  export let size = "md";
  export let neutral = false;
  export let product = false;
  export let secondary = false;
  export let dark = false;
  export let leave = false;
  export let icon = false;
  export let text = false;

  // used in CTAs for error notifications.
  export let error = false;

  // used for very compact, small buttons.
  export let compact = false;

  export let disabled = false;
  export let customClass;
  export let btnID;
  export let customControl = false;
  export let textColor;
  export let background;
  export let borderColor;

  const forwardAll = forwardEvents(getComponent());

  $: sizeClass = size ? `mzp-t-${size}` : undefined;
  $: productClass = product ? `mzp-t-product` : undefined;
  $: neutralClass = neutral ? `mzp-t-neutral` : undefined;
  $: secondaryClass = secondary ? `rwp-secondary` : undefined;
  $: darkClass = dark ? `mzp-t-dark` : undefined;
  $: leaveClass = leave ? `mzp-t-leave` : undefined;
  $: iconClass = icon ? "mzp-t-icon" : undefined;
  $: textClass = text ? "mzp-t-secondary mzp-t-text" : undefined;
  $: errorClass = error ? "mzp-t-error" : undefined;
  $: compactClass = compact ? "mzp-t-compact" : undefined;
  $: customClass = customClass ? customClass : undefined;
  $: customControlClass = customControl ? "custom-control" : undefined;
  $: classSet = [
    "mzp-c-button",
    sizeClass,
    productClass,
    neutralClass,
    darkClass,
    secondaryClass,
    leaveClass,
    textClass,
    iconClass,
    errorClass,
    compactClass,
    customClass,
    customControlClass,
  ]
    .filter((t) => t)
    .join(" ");

  // custom styles

  export let styles = {
    "btn-color": textColor,
    "btn-bg": background,
    "btn-border": borderColor,
  };

  $: cssVarStyles = Object.entries(styles)
    .map(([key, value]) => `--${key}:${value}`)
    .join(";");
</script>

<button
  id={btnID}
  style={cssVarStyles}
  use:forwardAll
  class={classSet}
  disabled={disabled}><slot /></button
>

<style>
  .custom-control {
    background-color: var(--btn-bg, black);
    color: var(--btn-color, white);
    border-color: var(--btn-border, black);
  }

</style>
