<script lang="ts">
    import { onMount } from "svelte";

    import Header from '$lib/components/Header.svelte';
    import Face from '$lib/components/Face.svelte';
    import Questionnaire from '$lib/components/Questionnaires.svelte';
    
    import callApi from '$lib/api.ts';
    

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
    
    
    let detections = {};
    let expressionHistory;
    
    async function waitForExpressionHistory() {
        while (!expressionHistory) {
            await new Promise(r => setTimeout(r, 50));
        }
    }

    async function queryWithExpressions() {
        await waitForExpressionHistory();
        expressionHistory.startContinuousExpressionTracking();

        const emotionSummary = await expressionHistory.collectExpressions(5000);
        const formattedEmotions = expressionHistory.formatExpressionsPrompt(emotionSummary);

        const userPrompt = `
            Here are the expressions this person is making at you:
            \n${formattedEmotions}\n
        `;

        const response = await callApi(userPrompt);
        const resultText = response.choices?.[0]?.message?.content;
        console.log(resultText);

    }
    
    onMount(async () => {
        await new Promise(resolve => setTimeout(resolve, 5000));

        await queryWithExpressions();
    });
    
    
    
    
</script>

<Header mode={headerMode} />
<Questionnaire on:submit={handleSubmission} on:typing={handleTyping} />

<main>
    <!-- <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
     -->
    <div class="face-row">
        <Face bind:detections bind:this={expressionHistory} />
    </div>
    
    
</main>
