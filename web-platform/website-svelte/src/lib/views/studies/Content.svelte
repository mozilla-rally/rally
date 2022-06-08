<script>
  import Accordion from "$lib/components/accordion/Accordion.svelte";

  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import StudyCardContainer from "./StudyCardContainer.svelte";
  import StudyUsageTooltip from "./StudyUsageTooltip.svelte";

  export let studies = [];
  export let userStudies = {};

  const dispatch = createEventDispatcher();

  function joinStudy(studyId) {
    dispatch("join-study", studyId);
  }

  function leaveStudy(studyId) {
    dispatch("leave-study", studyId);
  }

  function parseDateIfNeeded(date) {
    if (
      date === undefined ||
      (typeof date === "object" && typeof date.getMonth === "function")
    )
      return date;
    try {
      let endDate = date.split("-");
      let day = +endDate[2];
      let month = +endDate[1] - 1;
      let year = +endDate[0];
      return new Date(year, month, day);
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
</script>

<div class="current-studies" in:fly={{ duration: 800, y: 5 }}>
  <h2 class="section-header">Current Studies</h2>

  <p class="section-sub-header">
    Browse available studies and find the choice (or choices) that feel right to
    you.
  </p>

  <Accordion revealed={true}>
    <div slot="title">How to join a study</div>
    <slot><StudyUsageTooltip class="mb-0" /></slot>
  </Accordion>

  <div class="studies">
    {#each studies as study, i (study.studyId)}
      <StudyCardContainer
        title={study.name}
        author={study.authors.name}
        joined={study.studyId in userStudies &&
          userStudies[study.studyId].enrolled}
        imageSrc={study.icons[64]}
        studyId={study.studyId}
        endDate={parseDateIfNeeded(study.endDate)}
        description={study.description}
        dataCollectionDetails={study.dataCollectionDetails}
        studyDetailsLink={study.studyDetailsLink}
        tags={study.tags}
        downloadUrl={study.downloadLink}
        on:cta-clicked
        on:join={() => {
          joinStudy(study.studyId);
        }}
        on:leave={() => {
          leaveStudy(study.studyId);
        }}
      />
    {:else}
      No available studies
    {/each}
  </div>
</div>

<style>
  .current-studies {
    min-height: calc(100vh - 4rem);
  }
  p {
    margin: 0;
  }
  .studies {
    margin-top: 28px;
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 1rem;
  }
  .section-header {
    margin-bottom: 12px;
  }
  .section-sub-header {
    margin-bottom: 36px;
  }
</style>
