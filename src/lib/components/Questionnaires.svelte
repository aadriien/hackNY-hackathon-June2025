<script lang="ts">
  import { createEventDispatcher } from 'svelte';
    function handleTypingInput() {
    dispatch('typing');
    }

  const dispatch = createEventDispatcher();

  const questions: string[] = [
    "Congrats, you just turned 21. Now, what would you tell the bartender when you order a drink? And what drink would that be? ",
    "If you have a free afternoon, and you decide to not bedrot for the first time, what would you do?",
    "Where do you shop?",
    "Tell me your spotify wrap top genres. Don't fake it, we know you're basic"
  ];

  let answers: string[] = Array(questions.length).fill('');
  let currentQuestion = 0;

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      currentQuestion += 1;
    }
  }

  function handleBack() {
    if (currentQuestion > 0) {
      currentQuestion -= 1;
    }
  }

  function handleSubmit() {
    const finalResponse = questions
      .map((q, i) => `${q}: ${answers[i]}`)
      .join(' | ');
    dispatch('submit', finalResponse);
  }
</script>

<div class="questionnaire-container">
  <h3 class="question-title">
    Question {currentQuestion + 1}/{questions.length}
  </h3>

  <div class="question-block">
    <p class="question-text">{questions[currentQuestion]}</p>

    <input
      type="text"
      class="question-input"
      placeholder="Say what's on your mind"
      bind:value={answers[currentQuestion]}
      on:input={handleTypingInput}
    />

    <div class="button-row">
      {#if currentQuestion > 0}
        <button
          type="button"
          on:click={handleBack}
          class="action-button"
        >
          Back
        </button>
      {/if}

      {#if currentQuestion < questions.length - 1}
        <button
          type="button"
          on:click={handleNext}
          disabled={!answers[currentQuestion]}
          class="action-button {answers[currentQuestion].trim() ? 'ready' : 'disabled'}"
        >
          Next
        </button>
      {:else}
        <button
          type="button"
          on:click={handleSubmit}
          disabled={answers.some(ans => ans.trim() === "")}
          class="action-button {answers.some(ans => ans.trim() === '') ? 'disabled' : 'ready'} submit-button"
        >
          Submit
        </button>
      {/if}
    </div>
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
  text-align: left;
  gap: 24px;
}

.action-button {
  appearance: none;
  background-color: transparent;
  border: 2px solid #1A1A1A;
  border-radius: 15px;
  box-sizing: border-box;
  color: #3B3B3B;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
  min-height: 60px;
  min-width: 0;
  outline: none;
  padding: 16px 24px;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 100%;
  will-change: transform;
}

.action-button:disabled {
  pointer-events: none;
}

.action-button:hover {
  color: #fff;
  background-color: #1A1A1A;
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  transform: translateY(-2px);
}

.action-button:active {
  box-shadow: none;
  transform: translateY(0);
  background-color: antiquewhite;
}
</style>
