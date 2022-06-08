<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { fly } from "svelte/transition";

  export let onboarding = true;
</script>

<div class="terms main-content">
  <h2 class="section-header terms__header">Our Privacy Notice</h2>

  {#if onboarding}
    <p>
      Before you get started, please make sure you're comfortable with our
      privacy notice.
    </p>
  {:else}
    <p>Put your data to work and start building a better internet.</p>
  {/if}

  <hr />

  <h3>Introduction</h3>

  <p>
    In this notice, we detail what data Mozilla Rally collects and discloses,
    and why it does so.
  </p>

  <div class="icon-explanation-block">
    <img
      class="icon-block-left"
      width="84"
      src="/img/new-platform.png"
      alt="Mozilla Rally is a new platform created to empower people to contribute their data towards <b>building a better internet"
    />
    <div class="icon-block-right content-text-info">
      Mozilla Rally is a <b>new platform</b> created to empower people to
      contribute their data towards <b>building a better internet</b>.
    </div>
    <img
      class="icon-block-left"
      width="111"
      src="/img/who-is-eligible.png"
      alt="It is currently available to Firefox and Chrome users in the U.S. who are 19 or older."
    />
    <div class="icon-block-right content-text-info" style="max-width: 514px;">
      It is currently available to Firefox and Chrome users in the U.S. who are
      19 or older.
    </div>
    <img
      class="icon-block-left"
      width="83"
      src="/img/notice-covers-rally.png"
      alt="It is currently available to Firefox users in the U.S. who are 19 or older."
    />
    <div class="icon-block-right content-text-info">
      <b>This notice only covers Rally itself</b>, as each study will have a
      unique privacy notice detailing how data is collected and handled in that
      particular study. We also adhere to the
      <a
        href="https://www.mozilla.org/en-US/privacy/"
        target="_blank"
        rel="noopener noreferrer">Mozilla Privacy Policy</a
      >
      for how we receive, handle, and share information.
    </div>
  </div>
  <h3>The Types of Information We Collect</h3>

  <p>
    When you click “Accept and Enroll” below, you are consenting to data
    collection, which could include:
  </p>

  <div class="icon-explanation-block">
    <img
      class="icon-block-left"
      width="95"
      src="/img/your-demographic-data.png"
      alt="Your Demographic Data."
    />
    <div class="icon-block-right">
      <h4>Your Demographic Data</h4>
      <div class="content-text-info">
        This includes your <b>age</b>, <b>gender</b>, <b>race/ethnicity</b>,
        <b>education level</b>, <b>household income</b>, and <b>zip code</b>.
        This is entirely optional. We collect this information so researchers
        can understand how Rally users compare to the general population.
      </div>
    </div>

    <img
      class="icon-block-left"
      width="109"
      src="/img/your-technical-data.png"
      alt="Your Device's Technical Data."
    />
    <div class="icon-block-right">
      <h4>Your Device's Technical Data</h4>
      <div class="content-text-info">
        This includes your device's <b>operating system</b> and
        <b>IP address</b> (which we'll only hang on to temporarily).
      </div>
    </div>

    <img
      class="icon-block-left"
      width="97"
      src="/img/your-interaction-data.png"
      alt="Your interaction data."
    />
    <div class="icon-block-right">
      <h4>Your Interaction Data</h4>
      <div class="content-text-info">
        This includes your <b>interactions with</b> the Rally website and with
        <b>your web browser</b>. Interaction data includes the number and type
        of browser extensions you have installed, your interactions with the
        Rally add-on itself, and the duration of your active browsing session.
        We collect this data to understand usage, prioritize new features, and
        confirm all Rally systems are working properly.
      </div>
    </div>

    <img
      class="icon-block-left"
      width="97"
      src="/img/your-contact-data.png"
      alt="Your Contact Data."
    />

    <div class="icon-block-right">
      <h4>Your Contact Data</h4>
      <div class="content-text-info">
        This includes your <b>email address</b>, which we use to authenticate
        and help you administer your login account. We also use your email
        address to send you notifications on the studies you have joined.
      </div>
    </div>

    <img
      class="icon-block-left"
      width="82"
      src="/img/your-location-data.png"
      alt="Your Location Data."
    />
    <div class="icon-block-right">
      <h4>Your Location Data</h4>
      <div class="content-text-info">
        This includes your <b>country</b>, <b>city</b>, and <b>state</b>
        location, which is determined by your <b>IP address</b>.
      </div>
    </div>
      <div class="icon-block-right">
        <h4>Study-Specific Data</h4>
        <div class="content-text-info">
          Studies may collect additional data, depending on the purpose of the study.
          Each study description will disclose the particular data collected for that
          study. This data may include the websites you visit, your search engine results,
          and data cookies, pixels and other information set by particular websites.
        </div>
      </div>
  </div>

  <h3>How We Use Your Information</h3>

  <p>
    We use the information we collect for research and development, which could
    mean:
  </p>

  <div class="icon-explanation-block">
    <img
      class="icon-block-left align-start"
      width="125"
      src="/img/how-we-use-your-information.png"
      alt="How We Use Your Information."
    />
    <ul class="mzp-u-list-styled icon-block-right">
      <li>
        determining which Rally participants could be eligible to participate in
        particular research studies, should they choose to enroll
      </li>
      <li>
        ensuring that the data we collect represents the diverse communities
        that use the internet
      </li>
      <li>improving Mozilla's existing products and services</li>
      <li>creating and developing new products</li>
    </ul>
  </div>

  <h3>Who We May Share Information With</h3>

  <p>
    We may share information with trusted entities that help us fulfill our
    mission, including:
  </p>

  <div class="icon-explanation-block">
    <img
      class="icon-block-left"
      width="99"
      src="/img/data-storage-provider.png"
      alt="Our Data Storage Provider."
    />
    <div class="icon-block-right">
      <h4>Our Data Storage Provider</h4>

      <div class="content-text-info">
        We use Google's cloud storage service to store the data collected
        through Rally. Google only stores Rally data and <b
          >cannot use that data for its own purposes</b
        >.
      </div>
    </div>

    <img
      class="icon-block-left"
      width="117"
      src="/img/our-research-collaborators.png"
      alt="Our Research Collaborators."
    />
    <div class="icon-block-right">
      <h4>Our Research Collaborators</h4>

      <div class="content-text-info">
        Rally collaborates with trusted third parties to build and release
        studies. For any studies you join, we may ask you to share the data
        collected under <b>this Privacy Notice</b> with third party
        researcher(s) administering the study. Our research collaborators are
        under contracts with Mozilla to ensure that
        <b>your data is protected</b> and handled only in ways we've approved.
      </div>
    </div>

    <img
      class="icon-block-left"
      width="118"
      src="/img/people-like-you.png"
      alt="People Like You (only aggregated data)."
    />
    <div class="icon-block-right">
      <h4>People Like You (only aggregated data)</h4>

      <div class="content-text-info">
        Our mission is focused on <b>empowering everyday citizens</b>, not just
        a select few. To that end, we may release aggregated, de-identified data
        sets to help further public knowledge on certain issues. These data sets
        will be <b>stripped of any identifiable data</b>, and won't reveal
        anything about individual users.
      </div>
    </div>
  </div>

  <h3>How You Can Manage Your Data</h3>
  <p>
    Our "opt-in" approach to data collection means that you choose which data
    you share with us.
  </p>

  <div class="icon-explanation-block">
    <img
      class="icon-block-left"
      width="96"
      src="/img/manage-your-data.png"
      alt="How You Can Manage Your Data."
    />
    <!-- accommodate the link breaking -->
    <div class="icon-block-right">
      <p>
        Rally operates based on <b>your participation</b> – meaning you can
        choose to disclose the level of information you're comfortable with,
        either by finding a study that matches your level of comfort or by
        declining to share demographic information in your profile. <br /><a
          target="_blank"
          rel="noopener noreferrer"
          href="https://support.mozilla.org/en-US/kb/mozilla-rally-managing-account-data"
          >Learn more about managing your data</a
        >.
      </p>
      <p>
        If you have any other questions regarding our privacy practices, please
        contact us at <a href="mailto:compliance@mozilla.com"
          >compliance@mozilla.com</a
        >.
      </p>
    </div>
  </div>
</div>

<style>
  h2 {
    margin-bottom: 0;
  }

  h3 {
    font-size: 24px;
    margin-bottom: 8px;
    margin-top: 0;
    font-family: "Zilla Slab", -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
  }

  p,
  div,
  li {
    letter-spacing: -0.01em;
  }

  h4 {
    font-size: 16px;
    margin-bottom: 4px;
    margin-top: 0;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }
  h2,
  h3,
  h4 {
    color: var(--color-ink-50);
  }

  h2,
  h3 {
    color: var(--color-ink-50);
    padding: 1rem;
  }

  h4 {
    padding-right: 1rem;
  }

  p,
  ul {
    color: var(--color-marketing-gray-70);
    padding: 1rem;
    margin: 0;
  }

  hr {
    border-top: 0.5px dashed var(--color-black);
    margin: 22px 12px;
  }

  .icon-explanation-block {
    display: grid;
    grid-template-columns: [icon] 140px [body] auto;
    grid-auto-rows: minmax(100px, auto);
    grid-row-gap: 27px;
    grid-column-gap: 27px;
    padding-top: 16px;
    padding-bottom: 48px;
  }

  .content-text-info {
    padding-right: 1rem;
  }

  .icon-block-left {
    margin: auto;
    grid-column: icon;
    justify-self: center;
  }

  .icon-block-right {
    grid-column: body;
    align-self: center;
    max-width: 504px;
    color: var(--color-marketing-gray-70);
  }

  .icon-block-right p:last-child {
    margin: 0;
  }
  .align-start {
    margin: 0 auto;
  }

  .mzp-u-list-styled li {
    margin-bottom: 0.5em;
  }

  @media only screen and (max-width: 436px) {
    .icon-explanation-block {
      grid-template-columns: auto;
      grid-column-gap: unset;
    }
  }
</style>
