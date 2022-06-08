<script>
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  import { fly } from "svelte/transition";
  // FIXME: move everything in profile/ into the place it belongs?
  import ClearAnswerButton from "./ClearAnswerButton.svelte";
  import { schema, inputFormatters } from "./survey-schema";
  import {
    questionIsAnswered,
    clearAnswer,
    createResultObject,
  } from "./survey-tools";
  import { formatInput, formatAnswersForResponse } from "./formatters";

  export let isAuth 
  export let results = createResultObject(schema);
  export let workingResults = createResultObject(schema, results);
  $: workingResults = createResultObject(schema, workingResults);
  // create the outputted formatted workingResults.
  export let formattedResults = formatAnswersForResponse(
    schema,
    workingResults,
    inputFormatters
  );
  $: formattedResults = formatAnswersForResponse(
    schema,
    workingResults,
    inputFormatters
  );
</script>

<div class={`profile ${ isAuth ? "" : "main-content"}`}>
  <h2 class="section-header profile__header">Tell Us About Yourself</h2>

  <p class="profile__description">
    Each question is completely optional, and can be updated at any time by
    clicking Manage Profile. The answers you give will help us understand the
    composition and representivity of the Rally community. Additionally,
    collaborators will combine your answers with the data collected in the
    studies you join to enrich their findings and answer research questions.
  </p>

  <hr />

  <form class="mzp-c-form">
    {#each Object.keys(workingResults) as question}
      <fieldset
        class="mzp-c-field-set"
        class:mzp-c-field-set-text={schema[question].type === "text"}
      >
        <legend
          class="mzp-c-field-label"
          for={schema[question].key}
          class:remove-bottom-margin={schema[question].sublabel}
        >
          {schema[question].label}
          {#if questionIsAnswered(workingResults[question], schema[question].type)}
            <ClearAnswerButton
              on:click={(e) => {
                e.preventDefault();
                workingResults[question] = clearAnswer(schema[question].type);
              }}
            />
          {/if}
        </legend>
        {#if schema[question].sublabel}
          <div style="padding-top: -8px; padding-bottom: 20px;">
            {schema[question].sublabel}
          </div>
        {/if}

        <div
          class="mzp-c-choices"
          class:two-columns={schema[question].columns}
          style="--rows: {schema[question].values
            ? Math.ceil(schema[question].values.length / 2)
            : 0};"
        >
          {#if schema[question].type === "text"}
            <div
              class="mzp-c-choice mzp-c-choice-text"
              class:mzp-is-error={inputFormatters.showErrors(question) &&
                inputFormatters.hasValidator(question) &&
                inputFormatters[question].isInvalid(workingResults[question])}
            >
              <input
                type="text"
                use:formatInput={inputFormatters[question]}
                class:right={inputFormatters[question].alignRight}
                on:blur={(event) => {
                  workingResults[question] = event.target.value;
                }}
                on:focus={(event) => {
                  workingResults[question] = event.target.value;
                }}
                on:input={(event) => {
                  workingResults[question] = event.target.value;
                }}
                value={workingResults[question]}
              />
              <span style="min-height: 24px; display: block;">
                {#if inputFormatters.showErrors(question) && inputFormatters.hasValidator(question) && inputFormatters[question].isInvalid(workingResults[question])}
                  // show errors if blurred // show errors if there's a
                  validator for this question
                  <span
                    class="mzp-c-fieldnote"
                    transition:fly|local={{ duration: 300, y: 5 }}
                  >
                    {inputFormatters[question].isInvalid(
                      workingResults[question]
                    )}
                  </span>
                {/if}
              </span>
            </div>
          {:else}
            {#each schema[question].values as answer}
              <div class="mzp-c-choice">
                {#if schema[question].type === "single"}
                  <input
                    class="mzp-c-choice-control"
                    type="radio"
                    id="answer-{answer.key}"
                    bind:group={workingResults[question]}
                    value={answer.key}
                  />
                {:else if schema[question].type === "multi"}
                  <input
                    class="mzp-c-choice-control"
                    type="checkbox"
                    id="answer-{answer.key}"
                    bind:group={workingResults[question]}
                    value={answer.key}
                  />
                {/if}
                <label class="mzp-c-choice-label" for="answer-{answer.key}">
                  {answer.label}
                </label>
              </div>
            {/each}
          {/if}
        </div>
      </fieldset>
    {/each}
  </form>
  <!-- Add a slot to aid in  -->
  <slot
    name="call-to-action"
    formattedResults={formatAnswersForResponse(
      schema,
      workingResults,
      inputFormatters
    )}
    validated={inputFormatters.validateAllQuestions(schema, workingResults)}
  />
</div>

<style>
  h2 {
    color: var(--color-ink-50);
    padding: 0.625rem;
  }

  p,
  form {
    color: var(--color-marketing-gray-70);
    padding: 0.625rem;
  }

  p,
  div {
    letter-spacing: -0.01em;
  }

  /* this selects only checkbox or radio */
  [class="mzp-c-choice"] {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 1rem;
  }

  .mzp-c-choice-text {
    min-height: 1rem;
  }

  .mzp-c-field-set-text {
    padding-bottom: 0;
  }

  .mzp-c-field-label.remove-bottom-margin {
    padding-bottom: 0;
  }

  .mzp-c-choice {
    padding-bottom: 8px;
  }

  .mzp-c-choice-label {
    font-weight: normal;
    font-size: 1rem;
  }

  label,
  input {
    cursor: pointer;
  }

  input[type="text"] {
    cursor: auto;
    border: 2px solid #cdcdd4;
    width: 14rem;
    min-width: 14rem;
    transition: border-color 200ms;
  }

  input[type="text"].right {
    text-align: right;
  }
  input[type="text"]:focus {
    border-color: #0250bb;
    box-shadow: 0 0 0 2px #0250bb;
  }
  .mzp-is-error input[type="text"] {
    border: 2px solid #d70022;
    color: #d70022;
  }

  .mzp-is-error input[type="text"]:focus {
    box-shadow: 0 0 0 2px #d70022;
  }

  .mzp-c-choice-control[type="radio"] + label,
  .mzp-c-choice-control[type="checkbox"] + label {
    margin-left: 0.5rem;
  }

  /* correct for Protocol's radio and checkbox misalignments */
  .mzp-c-choice-control[type="radio"] + label::before {
    transform: translateY(0.25rem);
  }

  .mzp-c-choice-control[type="checkbox"] + label::before {
    transform: translateY(0.25rem);
  }

  .mzp-c-choice-control[type="checkbox"]:checked + label::after {
    transform: translateY(0.215rem) rotate(45deg);
  }

  legend {
    color: var(--color-ink-50);
    font-size: 1rem;
  }

  fieldset {
    /* position: inherit; */
    padding-bottom: 3.75rem;
  }

  fieldset:last-child {
    padding-bottom: 0;
  }

  .mzp-c-choices {
    width: 100%;
    padding-bottom: 0;
    padding-left: 1rem;
  }

  .two-columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, 173px);
    grid-template-rows: repeat(var(--rows, 3), max-content);
    justify-content: start;
    grid-column-gap: 4rem;
    width: 80%;
  }
</style>
