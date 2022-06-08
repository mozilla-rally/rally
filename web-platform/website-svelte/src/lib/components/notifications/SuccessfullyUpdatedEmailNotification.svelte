<script>
    /* This Source Code Form is subject to the terms of the Mozilla Public
     * License, v. 2.0. If a copy of the MPL was not distributed with this
     * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  
    import Notification from "./NotificationElement.svelte";
    let xOffset = '14px';
    let pad = '100px'
    let location = "top-center";
    let level = "info"
  </script>
  
  <Notification {location} {xOffset} {level} {pad}>
    <span style="display: contents;" slot="icon">
      <img src="img/icon-status-checkmark.svg" alt="checkmark icon">
    </span>
    <span slot="body">Successfully updated email address</span>
  </Notification>