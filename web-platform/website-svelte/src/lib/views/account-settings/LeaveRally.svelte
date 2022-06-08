<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import Button from "../../../lib/components/Button.svelte";
</script>

<div class="leave-rally-wrapper">
  <h5 class="setting-title">Before You Go…</h5>
  <div class="split-content-modal">
    <div class="leave-rally-content">
      <p class="lead">
        Thanks for helping make the internet just a little bit better. For your
        reference, leaving Rally means that:
      </p>
      <ul class="mzp-u-list-styled bigger-gap">
        <li>
          We will <b>no longer collect any data</b> for our platform or studies
        </li>
        <li>
          You will be <b>removed from any studies</b> you're currently participating
          in
        </li>
        <li>
          We will <b>delete any demographic information</b> you've shared with us
        </li>
        <li>
          If you are currently enrolled in an open study, we will <b
            >delete all data</b
          >
          we've collected through that study to date. However, researchers may still
          retain access to data you've contributed to
          <b>completed studies</b>.
        </li>
        <li>
          We will <b>uninstall and remove the Rally add-on</b>, and any
          associated study add-ons that you may have installed.
        </li>
      </ul>
    </div>
    <img
      src="img/before-you-go.png"
      alt="person walking through exit door"
      class="leave-rally-img"
    />
  </div>
  <div class="modal-call-flow">
    <Button custom="btn-settings" size="lg" product leave>Leave Rally</Button>
  </div>
</div>

<style>
  .split-content-modal {
    margin-bottom: 24px;
    box-sizing: content-box;
  }

  .leave-rally-content {
    width: 368px;
  }
  .lead {
    padding-bottom: 10px;
    padding-top: 20px;
  }

  .bigger-gap {
    padding-right: 36px;
  }

  .leave-rally-img {
    width: 270px;
    padding-top: 40px;
    transform: translateX(-24px);
  }
</style>
