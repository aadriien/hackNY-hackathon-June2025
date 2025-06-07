<script lang="ts">
  export let mode: 'default' | 'typing' | 'submitted' = 'default';
</script>

<div class="header">
  {#if mode === 'default'}
    <img src="src/assets/Default.svg" alt="Logo" class="logo" />
    <h1 class="title">We are Vibe Reader --- now read that again out loud, but quickly</h1>
  {:else if mode === 'typing'}
    <img src="src/assets/Typing.svg" alt="Typing Logo" class="logo" />
    <h1 class="title">I know what you are.... I see what you do</h1>
  {:else if mode === 'submitted'}
    <img src="src/assets/Result.svg" alt="Submitted Logo" class="logo" />
    <h1 class="title">okay</h1>
  {/if}
</div>

<style>
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 2rem;
  }

  .logo {
    width: 400px;
    height: auto;
    margin-bottom: 1rem;
  }

  .title {
    font-size: 2rem;
    font-family: 'Playfair Display', serif;
    font-weight: 600;
  }
</style>
