<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Questionnaire from '$lib/components/Questionnaires.svelte';

  let headerMode: 'default' | 'typing' | 'submitted' = 'default';

  function handleTyping() {
    if (headerMode !== 'typing') {
      headerMode = 'typing';
    }
  }

  function handleSubmission(event: CustomEvent<string>) {
    const finalResponse = event.detail;
    console.log("User responses:", finalResponse);
    headerMode = 'submitted';
  }
</script>

<div class="layout">
  <div class="header-side">
    <Header mode={headerMode} />
  </div>
  <div class="form-side">
    <Questionnaire on:submit={handleSubmission} on:typing={handleTyping} />
  </div>
</div>

<style>
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
  }

  .form-side {
    flex: 1;
    max-width: 600px;
    min-width: 320px;
  }
</style>
