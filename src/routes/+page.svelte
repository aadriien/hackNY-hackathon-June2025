<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Questionnaire from '$lib/components/Questionnaires.svelte';
  import Face from '$lib/components/Face.svelte';
  import callApi from "$lib/api";
import type FaceComponent from '$lib/components/Face.svelte';

let faceRef: InstanceType<typeof FaceComponent> | null = null;

  let headerMode: 'default' | 'typing' | 'submitted' = 'default';
  let hasInteracted = false;


  function handleTyping() {
    if (headerMode !== 'typing') {
      headerMode = 'typing';
    }
  }

  function startExperience() {
    hasInteracted = true;
    headerMode = 'default';
  }

  function restartExperience() {
    hasInteracted = false;
    headerMode = 'default';
  }

  async function handleSubmission(event: CustomEvent<string>) {
    const finalResponse = event.detail;
    console.log("User answers:", finalResponse);

    let expressionsPrompt = "No facial expressions captured.";
    try {
      const summary = await faceRef?.collectExpressions?.();
      expressionsPrompt = faceRef?.formatExpressionsPrompt?.(summary) ?? expressionsPrompt;
    } catch (err) {
      console.warn("Facial data unavailable:", err);
    }

    const mergedPrompt = `
    Questionnaire Responses:
    ${finalResponse}

    Facial Expressions Summary:
    ${expressionsPrompt}
    `;

    try {
      const response = await callApi(mergedPrompt);
      const result = response.choices?.[0]?.message?.content ?? "No result received.";
      console.log("Final result:", result);
      headerMode = 'submitted';
    } catch (e) {
      console.error("API failed:", e);
      headerMode = 'submitted';
    }
  }
</script>

<main>
  {#if !hasInteracted}
    <div class="start-screen">
      <button class="start-button" on:click={startExperience}>
        Click this button if you like reading
      </button>
    </div>
  {:else}
    <div class="layout">
      <div class="header-side">
        <Header mode={headerMode} />
        {#if headerMode === 'submitted'}
          <button class="restart-button" on:click={restartExperience}>
            Restart
          </button>
        {/if}
      </div>
      <div class="form-side">
        <Questionnaire
          on:submit={handleSubmission}
          on:typing={handleTyping}
          {Face}
          bind:faceRef
        />
      </div>
    </div>
  {/if}
</main>

<style>
  .start-screen {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
  }

  .start-button {
    font-size: 1.5rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: 1rem;
    background-color: black;
    color: white;
    cursor: pointer;
  }

  .layout {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 4rem;
    gap: 4rem;
    flex-wrap: wrap;
  }

  .header-side {
    flex: 1;
    max-width: 400px;
    min-width: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form-side {
    flex: 1;
    max-width: 600px;
    min-width: 320px;
  }

  .restart-button {
    margin-top: 2rem;
    padding: 0.75rem 1.5rem;
    background-color: #1a1a1a;
    color: white;
    border: none;
    border-radius: 1rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .restart-button:hover {
    background-color: #333;
  }
</style>
