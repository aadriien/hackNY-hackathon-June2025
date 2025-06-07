<script lang="ts">
    import { onMount } from 'svelte';
    export let mode: 'default' | 'typing' | 'submitted' = 'default';
    
    let audio: HTMLAudioElement;
    
    function updateAudioSource(mode: typeof mode) {
        const src =
        mode === 'typing'
        ? '/assets/audio/typing.mp3'
        : mode === 'submitted'
        ? '/assets/audio/result.mp3'
        : '/assets/audio/default.mp3';
        
        if (audio) {
            audio.pause();
            audio.src = src;
            audio.load();
            audio.play().catch(() => {
                console.warn('Autoplay might be blocked');
            });
        }
    }
    
    $: updateAudioSource(mode);
    
    onMount(() => {
        updateAudioSource(mode);
    });
</script>


<main>
    <audio bind:this={audio} loop></audio>

    <div class="header">
        {#if mode === 'default'}
            <img src="/assets/Default.svg" alt="Logo" class="logo" />
            <h1 class="title">We are Vibe Reader --- now read that again out loud, but quickly</h1>
        {:else if mode === 'typing'}
            <img src="/assets/Typing.svg" alt="Typing Logo" class="logo" />
            <h1 class="title">I know what you are.... I see what you do</h1>
        {:else if mode === 'submitted'}
            <img src="/assets/Result.svg" alt="Submitted Logo" class="logo" />
            <h1 class="title">okay</h1>
        {/if}
    </div>
</main>


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
