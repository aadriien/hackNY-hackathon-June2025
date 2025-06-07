<script>
    import { onMount } from "svelte";
    import Face from '$lib/components/face.svelte';
    import Questionnaires from '$lib/components/Questionnaires.svelte';
    import ResultDisplay from '$lib/components/ResultDisplay.svelte';


    let detections = {};
    let expressionHistory;

    
    async function waitForExpressionHistory() {
        while (!expressionHistory) {
            await new Promise(r => setTimeout(r, 50));
        }
    }

    onMount(async () => {
        await waitForExpressionHistory();

        expressionHistory.startContinuousExpressionTracking();
        const emotionSummary = await expressionHistory.collectExpressions(5000);
        console.log(emotionSummary);
    });



</script>


<main>
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

    <div class="face-row">
        <Face bind:detections bind:this={expressionHistory} />
    </div>


</main>
