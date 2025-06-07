<!-- Header.svelte -->
<header class="header">
  <img src="/assets/VibeCheckerLogo.svg" alt="Logo" class="logo" />
  <h1 class="title">Wanna know if you pass the vibe check for NYC restaurants and bars? You probably don't anyways so don't even bother to try</h1>
</header>

<style>
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: #f3f4f6;
  }

  .logo {
    width: 48px;
    height: 48px;
  }

  .title {
    font-size: 1.25rem;
    font-weight: bold;
  }
</style>
