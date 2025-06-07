<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import callApi from '$lib/api';
  import Face from '$lib/components/Face.svelte';
  
  let faceComponent: any;

  const dispatch = createEventDispatcher();

  const questions: string[] = [
    "Congrats, you just turned 21. Now, what would you tell the bartender when you order a drink? And what drink would that be?",
    "If you have a free afternoon, and you decide to not bedrot for the first time, what would you do?",
    "Where do you shop?",
    "Tell me your Spotify Wrapped top genres. Don't fake it, we know you're basic",
    "Look into the camera for 5 seconds so we can analyze your expression"

  ];

  let answers: string[] = Array(questions.length).fill('');
  let currentQuestion = 0;
  let loading = false;

  let clickSound: HTMLAudioElement;
  let backSound: HTMLAudioElement;
  let submitSound: HTMLAudioElement;

  function playSound(audio: HTMLAudioElement) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function handleTypingInput() {
    dispatch('typing');
  }

  function handleNext() {
    playSound(clickSound);
    if (currentQuestion < questions.length - 1) {
      currentQuestion += 1;
    }
  }

  function handleBack() {
    playSound(backSound);
    if (currentQuestion > 0) {
      currentQuestion -= 1;
    }
  }

async function handleSubmit() {
  playSound(submitSound);
  loading = true;

  try {
    const resultText = questions
      .map((q, i) => `${q} ${answers[i]}`)
      .join(' | ');
      
    dispatch('submit', resultText);
  } catch (error) {
    console.error("API Error:", error);
    dispatch('submit', "Something went wrong while processing your vibe.");
  } finally {
    loading = false;
  }
}

</script>

<audio bind:this={clickSound} src="src/assets/audio/clickbutton.mp3" preload="auto" />
<audio bind:this={backSound} src="src/assets/audio/backbutton.mp3" preload="auto" />
<audio bind:this={submitSound} src="src/assets/audio/submit.mp3" preload="auto" />

<div class="questionnaire-container">
  <h3 class="question-title">
    Question {currentQuestion + 1}/{questions.length}
  </h3>

<div class="question-block">
  <p class="question-text">{questions[currentQuestion]}</p>

  {#if currentQuestion < 4}
    <input
      type="text"
      class="question-input"
      placeholder="Say what's on your mind"
      bind:value={answers[currentQuestion]}
      on:input={handleTypingInput}
    />
  {:else if currentQuestion === 4}
    <div class="face-capture">
    <Face bind:this={faceComponent} />
  </div>
  {/if}

  <div class="button-row">
    {#if currentQuestion > 0}
      <button type="button" on:click={handleBack} class="action-button">Back</button>
    {/if}

    {#if currentQuestion < questions.length - 1}
      <button
        type="button"
        on:click={handleNext}
        disabled={!answers[currentQuestion]?.trim()}
        class="action-button {answers[currentQuestion]?.trim() ? 'ready' : 'disabled'}"
      >
        Next
      </button>
    {:else}
      <button
        type="button"
        on:click={handleSubmit}
        disabled={answers.slice(0, 4).some(ans => ans.trim() === "") || loading}
        class="action-button {answers.slice(0, 4).some(ans => ans.trim() === '') || loading ? 'disabled' : 'ready'} submit-button"
      >
        {#if loading}
          Submitting...
        {:else}
          Submit
        {/if}
      </button>
    {/if}
  </div>

  {#if loading}
    <div class="loader-container">
      <img src="src/assets/cd_loader.png" alt="Loading..." class="png-loader" />
      <p>Reading your vibe...</p>
    </div>
  {/if}
</div>
</div>


<style>
  .questionnaire-container {
    background-color: rgba(226, 164, 181, 0.2);
    border-radius: 1rem;
    padding: 2rem;
    max-width: 600px;
    margin: 4rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  }

  .question-title {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .question-block {
    width: 100%;
    max-width: 400px;
  }

  .question-text {
    font-size: 1.125rem;
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .question-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    outline: none;
    border: 1px solid #ccc;
    margin-bottom: 2rem;
    box-sizing: border-box;
  }

  .button-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 1rem;
  }

  .action-button {
    background-color: transparent;
    border: 2px solid #1A1A1A;
    border-radius: 15px;
    color: #3B3B3B;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    padding: 16px 24px;
    width: 100%;
    transition: all 0.3s ease;
  }

  .action-button.ready:hover {
    background-color: #1A1A1A;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  }

  .action-button:disabled,
  .action-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-button:active {
    transform: translateY(0);
  }

  .submit-button {
    width: 100%;
  }

  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
    font-size: 1rem;
    font-style: italic;
    color: #3b3b3b;
  }

  .png-loader {
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
.face-capture {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
}

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
