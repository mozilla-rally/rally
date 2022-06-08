<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  export let clazz = "";

</script>

<main class={`mzp-t-mozilla main-content main-content--${clazz} default`}>
  <div class={`content-container content-container--${clazz}`}>
    <slot />
  </div>
</main>



