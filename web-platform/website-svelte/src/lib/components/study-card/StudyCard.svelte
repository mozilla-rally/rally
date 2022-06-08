<script type="ts">
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import AccordionButton from "../accordion/AccordionButton.svelte";
  import Button from "../Button.svelte";
  import ExternalLink from "../icons/ExternalLink.svelte";
  import OverflowEllipsis from "../icons/OverflowEllipsis.svelte";
  import Header from "./Header.svelte";
  import studyCategories from "./study-categories";
  import StudyStatusBadge from "./StudyStatusBadge.svelte";

  let revealed = false;

  export let endDate;
  export let downloadUrl;
  export let joined = false;
  export let connected = false;
  export let studyDetailsLink = undefined;
  export let imageSrc;
  export let dataCollectionDetails = [];
  export let tags = [];

  const dispatch = createEventDispatcher();

  $: {
    revealed = !joined;
  }
</script>

<div class="study-card-container radius-sm">
  <Header {endDate}>
    <span slot="study-top-section">
      {#if joined || connected}
        <div
          class={`d-flex status-container ${
            joined && connected ? "connected" : "not-connected"
          }`}
        >
          <StudyStatusBadge {joined} {connected} {downloadUrl} />
          {#if !connected || joined}
            <div class="dropdown">
              <button
                class="btn btn-link update-dropdown-link p-0 pt-0 d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <OverflowEllipsis color="#5E5E72" size="28px" />
              </button>

              <ul class="dropdown-menu dropdown-menu-bottom overflow-hidden">
                {#if !connected}
                  <li>
                    <a
                      class="dropdown-item text-body-sm"
                      href={downloadUrl}
                      target="_blank">Add study extension</a
                    >
                  </li>
                {/if}

                <li>
                  <a
                    class="dropdown-item text-body-sm"
                    on:click={() => dispatch("leave")}
                    href="#"
                    >{connected ? "Leave study" : "Don't join this study"}</a
                  >
                </li>
              </ul>
            </div>
          {/if}
        </div>
        <hr class="header-divider mb-0" />
      {/if}
    </span>
    <img
      slot="study-icon"
      class="study-card-image"
      width="60"
      alt="study icon"
      src={imageSrc || "img/default-study-icon.png"}
    />
    <span slot="study-name"><slot name="name">Study Title</slot></span>
    <span slot="study-author"><slot name="author">Study Author</slot></span>
    <span slot="study-cta" class="w-100">
      {#if !joined}
        <Button
          size={"md"}
          customClass={"w-100"}
          product={true}
          leave={false}
          on:click={() => {
            dispatch("join");
          }}
        >
          Join Study
        </Button>
      {/if}
    </span>
  </Header>
  <div class="study-body">
    <hr class="header-divider" />

    <div class="joined-study-accordion">
      <AccordionButton bind:revealed>
        <h4 class="study-card-subheader text-display-xxs">About this study</h4>
      </AccordionButton>
    </div>

    {#if revealed}
      <div class="study-card-body" transition:slide|local={{ duration: 200 }}>
        <div>
          <div class="study-card-description body-copy text-body-sm">
            <slot name="description">
              <p>description missing</p>
            </slot>
          </div>
          {#if dataCollectionDetails.length}
            <div
              class="study-card-section study-card-collected body-copy text-body-sm"
            >
              <h4
                class="study-card-subheader text-display-xxs"
                style="margin-bottom: 10px;"
              >
                Key Data Collected
              </h4>
              <ul
                class="mzp-u-list-styled study-card-section-body data-collection-details body-copy text-body-sm"
              >
                {#each dataCollectionDetails as detail}
                  <li>{detail}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
        <hr />

        <div class="study-card-footer">
          <div class="study-card-tags">
            {#each tags as tag}
              <div
                class="tag radius-sm"
                style={`
                color: ${
                  (studyCategories[tag] && studyCategories[tag].color) ||
                  "var(--color-marketing-gray-100)"
                }; 
                background: ${
                  (studyCategories[tag] && studyCategories[tag].background) ||
                  "white"
                };
                `}
              >
                {tag}
              </div>
            {/each}
          </div>

          <div class="study-card-privacy-policy">
            <a
              target="_blank"
              rel="noopener noreferrer"
              class="external-link"
              style="--spacing: 6px;"
              href={studyDetailsLink}
              >View Full Study Details <ExternalLink /></a
            >
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .study-card-container {
    --icon-size: 60px;
    --gap: 20px;
    --left-pad: calc(var(--icon-size) + var(--gap));

    box-shadow: var(--rally-box-shadow-sm);
    background-color: var(--color-white);
  }

  .study-card-description {
    grid-column: 1 / span 2;
    /* offset the last paragraph text margin by a bit more */
    margin-top: 5.5px;
    margin-bottom: 4px;
  }

  .study-body {
    padding: 24px;
    padding-top: 0;
  }

  h4 {
    letter-spacing: -0.2px;
    color: var(--color-marketing-gray-80);
    margin: 0;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  .study-card-cta {
    justify-self: end;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    height: 0;
    /* add additional margin to offset buttons from card pad */
    margin-top: 4px;
    margin-right: 4px;
  }

  .study-card-subheader {
    color: var(--color-ink-50);
  }

  .study-card-section-body {
    grid-area: body;
    align-self: start;
  }

  .study-card-footer {
    display: grid;
    grid-template-columns: auto max-content;
    align-items: center;
    padding-top: 14px;
    grid-column-gap: 3rem;
  }

  .study-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .data-collection-details li {
    margin: 0;
  }

  .data-collection-details li + li {
    margin-top: 8px;
  }

  .study-card-privacy-policy {
    font-size: 14px;
    align-self: start;
  }

  .tag {
    background-color: var(--background, var(--color-marketing-gray-80));
    color: var(--text, var(--color-white));
    padding: 0 4px;
    font-size: 12px;
    line-height: 21px;
    height: 20px;
    font-weight: 600;
    display: grid;
    place-items: center;
    text-transform: uppercase;
  }

  hr {
    margin: 0;
    padding: 0;
    border: none;
    border-bottom: 1px solid #c4c4c4;
  }

  .header-divider {
    margin-bottom: 20px;
  }

  .joined-study-accordion {
    display: grid;
    grid-template-columns: auto max-content;
    grid-gap: 36px;
  }

  .joined-study-accordion h4 {
    margin: 0;
  }

  .study-card-joined-date {
    margin: auto;
    font-size: 12px;
    text-align: center;
    color: var(--color-ink-10);
    font-weight: 600;
    font-style: italic;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    grid-column-gap: 6px;
  }

  .update-dropdown-link {
    text-decoration: none;
    border-radius: 50%;
    height: 28px;
    width: 28px;
    box-shadow: none;
  }

  .update-dropdown-link:hover {
    background-color: #cdcdd499;
  }

  .update-dropdown-link:global(.show) {
    background-color: #c8c8d0;
  }

  .status-container {
    justify-content: space-between;
    align-items: center;
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 11px;
    padding-bottom: 11px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  @media (max-width: 480px) {
    .status-container {
      align-items: flex-start;
    }
  }

  .status-container.connected {
    background: #d6fff2;
  }

  .status-container.not-connected {
    background: #ffe3c2;
  }

  .dropdown-menu li {
    display: flex;
  }
</style>
