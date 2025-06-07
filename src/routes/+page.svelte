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

<Header mode={headerMode} />
<Questionnaire on:submit={handleSubmission} on:typing={handleTyping} />

