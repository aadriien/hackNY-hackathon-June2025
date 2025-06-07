<script>
  export let result;
</script>

<div class="result-display">
  {#if result}
    <p>{result}</p>
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