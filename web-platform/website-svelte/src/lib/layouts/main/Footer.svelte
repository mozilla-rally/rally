<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
</script>

<svelte:body style="position: relative;" />

<footer class="footer">
  <div class="footer-wrapper">
    <div class="footer-content">
      <ul class="footer-list">
        <li class="footer-item">
          <a
            class="footer-item-link"
            href="__BASE_SITE__/how-rally-works/"
            target="_blank">How Rally Works</a
          >
          <ul class="footer-sublist">
            <li class="footer-sublist-item">
              <a
                class="footer-sublist-link"
                href="__BASE_SITE__/how-rally-works/data-and-privacy/"
                target="_blank">Data & Privacy</a
              >
            </li>
            <li class="footer-sublist-item">
              <a
                class="footer-sublist-link"
                href="__BASE_SITE__/how-rally-works/faqs/"
                target="_blank">FAQs</a
              >
            </li>
          </ul>
        </li>
        <li class="footer-item">
          <a
            class="footer-item-link"
            href="__BASE_SITE__/about-rally/"
            target="_blank">About Rally</a
          >
        </li>
        <li class="footer-item">
          <a
            class="footer-item-link"
            href="https://support.mozilla.org/en-US/kb/about-mozilla-rally"
            target="_blank">Support</a
          >
        </li>
      </ul>

      <ul class="footer-list">
        <li class="footer-item">
          <a class="footer-item-link" href="#studies">Current Studies</a>
          <ul class="footer-sublist">
            <li class="footer-sublist-item">
              <a href="#beyondthepaywall" class="footer-sublist-link">Beyond the Paywall</a>
            </li>
            <li class="footer-sublist-item">
              <a href="#covidnews" class="footer-sublist-link"
                >Political and Covid-19 News</a
              >
            </li>
          </ul>
        </li>
        <li class="footer-list">
          <a href="#careers" class="footer-item-link">Careers</a>
          <ul class="footer-sublist">
            <li class="footer-sublist-item">
              <a href="#apply" class="footer-sublist-link">Apply</a>
            </li>
            <li class="footer-sublist-item">
              <a href="#fullstack" class="footer-sublist-link"
                >Full-Stack Software Engineer</a
              >
            </li>
          </ul>
        </li>
      </ul>

      <ul class="footer-list">
        <li class="footer-item">
          <a href="" class="footer-item-link"> Past Studies</a>
          <ul class="footer-sublist">
            <li class="footer-sublist-link">
              <a href="" class="footer-sublist-link">
                Your Time Online and "Doomscrolling"</a
              >
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="footer-bottom">
      <p class="footer-copyright">
        © Mozilla 2022. We’re Building a Better Internet
      </p>
      <ul class="footer-social">
        <li class="footer-social-item">
          <a href="" class="footer-social-link">
            <img src="img/twitter.svg" alt="twitter icon" />
          </a>
        </li>
      </ul>
      <ul class="footer-legal">
        <li class="footer-legal-item">
          <a href="" class="footer-legal-link">Rally Privacy Policy</a>
        </li>
        <li class="footer-legal-item">
          <a href="" class="footer-legal-link">Mozilla Privacy policy</a>
        </li>
        <li class="footer-legal-item">
          <a href="" class="footer-legal-link">Legal</a>
        </li>
      </ul>
    </div>
  </div>
</footer>

<style>
  footer {
    background-color: #000;
    color: #fff;
    position: absolute;
    width: 100%;
  }

  footer a {
    color: #fff;
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }

  .footer-wrapper {
    padding: 1rem 8.5rem;
    margin-left: auto;
    margin-right: auto;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .footer-item-link {
    font-weight: 700;
    font-size: 1.125rem;
    display: inline-block;
    margin-bottom: 1rem;
  }

  .footer-sublist-link {
    display: inline-block;
    font-size: 0.9375rem;
    line-height: 1.4;
    padding: 0.1875rem 0;
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.6);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 2rem;
  }

  .footer-bottom .footer-social{
      order: 2;
  }

  .footer-copyright {
    font-size: 0.75rem;
    margin-bottom: 1.125rem;
    width: 100%;
    color: #fff;
  }

  .footer-social {
    display: flex;
    align-items: center;
    width: 23px; 
  }

  .footer-social-item{
      width: 100%;
  }

  .footer-legal {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    margin-top: -0.625rem;
    font-size: 0.75rem;
  }

  .footer-legal-item:not(:last-child) {
    margin-right: 1.875rem;
  }

  .footer-legal a {
    text-decoration: underline;
    white-space: nowrap;
  }

</style>
