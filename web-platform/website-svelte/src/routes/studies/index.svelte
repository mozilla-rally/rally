<script lang="ts">
  import { getContext } from "svelte";
  import { goto } from "$app/navigation";
  import StudiesContent from "$lib/views/studies/Content.svelte";

  import type { Readable } from "svelte/store";
  import type { AppStore } from "$lib/stores/types";
  import type { NotificationStore } from "$lib/components/notifications";

  const store: AppStore = getContext("rally:store");
  const isAuthenticated: Readable<boolean> = getContext(
    "rally:isAuthenticated"
  );
  const isExtensionConnected: Readable<boolean> = getContext(
    "rally:isExtensionConnected"
  );

  const notifications: NotificationStore = getContext("rally:notifications");

  function joinStudy(studyId) {
    const study = $store.studies.find((s) => s.studyId === studyId);

    if (!study) {
      throw new Error(`Study with id: ${studyId} not found.`);
    }

    if (!$isExtensionConnected) {
      window.open(study.downloadLink, "_blank");
    }

    store.updateStudyEnrollment(studyId, true);
    notifications.send({ code: "SUCCESSFULLY_JOINED_STUDY" });
  }

  function leaveStudy(studyId) {
    store.updateStudyEnrollment(studyId, false);
    notifications.send({ code: "SUCCESSFULLY_LEFT_STUDY" });
  }

  $: if ($store._initialized) {
    if (!$store?.user?.uid) {
      goto("/signup");
    } else if (!$store?.user?.enrolled) {
      goto("/welcome/terms");
    }
  }
</script>

<svelte:head>
  <title>Studies | Mozilla Rally</title>
</svelte:head>

{#if $store._initialized && $isAuthenticated === true}
  {#if $store.studies}
    <section>
      <div class="section-content section-content--studies">
        <StudiesContent
          sidebarOffset
          studies={$store.studies}
          userStudies={$store.userStudies || {}}
          on:cta-clicked={() => {
            notifications.clear();
          }}
          on:join-study={(evt) => {
            joinStudy(evt.detail);
          }}
          on:leave-study={(evt) => {
            leaveStudy(evt.detail);
          }}
        />
      </div>
    </section>
  {/if}
{/if}
