<!-- src/lib/components/Header.svelte -->
<div class="header">
  <img src="src/assets/VibeCheckerLogo.svg" alt="Logo" class="logo" />
  <h1 class="title">I'm Vibe Reader --- Read that carefully now</h1>
  <p>We're gonna check if you pass the vibe for nyc's restaurants and bars. You probably won't anyways, but it doesn't hurt to try </p>
</div>

<style>
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
    text-align: center;
  }

  .logo {
    width: 250px;
    height: auto;
    margin-bottom: 1rem;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 600;
    font-family: 'Playfair Display', serif;
  }
</style>
