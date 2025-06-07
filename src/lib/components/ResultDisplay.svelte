<script>
  export let result;
</script>

<div class="result-display">
  {#if result}
    <h2>Result:</h2>
    <pre>{JSON.stringify(result, null, 2)}</pre>
  {:else}
    <p>No result available.</p>
  {/if}
</div>

<style>
  .result-display {
    border: 1px solid #ccc;
    padding: 1em;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
</style>