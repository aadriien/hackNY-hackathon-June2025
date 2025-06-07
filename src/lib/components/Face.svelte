<script lang="ts">
  import { onMount } from "svelte";
  import * as faceapi from "face-api.js";

  export let detections: Record<string, number> | null = null;

  let videoElement: HTMLVideoElement;
  let overlayCanvas: HTMLCanvasElement;

  let expressionHistory: { timestamp: number; expressions: Record<string, number> }[] = [];
  let trackingInterval: ReturnType<typeof setInterval> | null = null;

  async function loadModels() {
    const MODEL_URL = "/models";

    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
      ]);
      console.log("Face-api.js models loaded.");
    } catch (err) {
      console.error("Model loading failed:", err);
    }
  }

  async function startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      await videoElement.play();
    } catch (err: any) {
      alert("Could not access webcam: " + err.message);
    }
  }

  async function drawLandmarks() {
    if (!videoElement || !overlayCanvas) return;

    const displaySize = {
      width: videoElement.videoWidth,
      height: videoElement.videoHeight
    };

    faceapi.matchDimensions(overlayCanvas, displaySize);

    const options = new faceapi.TinyFaceDetectorOptions();
    const detectionsWithLandmarks = await faceapi
      .detectAllFaces(videoElement, options)
      .withFaceLandmarks();

    const resizedResults = faceapi.resizeResults(detectionsWithLandmarks, displaySize);

    const context = overlayCanvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      faceapi.draw.drawDetections(overlayCanvas, resizedResults);
      faceapi.draw.drawFaceLandmarks(overlayCanvas, resizedResults);
    }
  }

  async function getExpressions() {
    const options = new faceapi.TinyFaceDetectorOptions();
    const result = await faceapi
      .detectSingleFace(videoElement, options)
      .withFaceExpressions();

    detections = result?.expressions ?? null;

    if (detections) {
      expressionHistory.push({ timestamp: Date.now(), expressions: detections });

      const cutoff = Date.now() - 5000;
      expressionHistory = expressionHistory.filter(e => e.timestamp >= cutoff);
      console.log(detections);

    }
  }

  function summarizeExpressions(history: typeof expressionHistory) {
    const totals: Record<string, number> = {
      neutral: 0, happy: 0, sad: 0, angry: 0,
      fearful: 0, disgusted: 0, surprised: 0
    };

    for (const entry of history) {
      for (const [emotion, value] of Object.entries(entry.expressions)) {
        totals[emotion] += value;
      }
    }

    const count = history.length;
    const averages: Record<string, number> = {};
    for (const [emotion, total] of Object.entries(totals)) {
      averages[emotion] = count ? total / count : 0;
    }

    return averages;
  }

  function getTopExpressions(expressions: Record<string, number> | null) {
    if (!expressions) return [];

    return Object.entries(expressions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);
  }

  function formatExpressionsPrompt(averages: Record<string, number>) {
    return Object.entries(averages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([emotion, value]) => `- ${emotion}: ${(value * 100).toFixed(1)}%`)
      .join('\n');
  }

  function collectExpressions(duration = 5000): Promise<Record<string, number>> {
    expressionHistory = [];

    return new Promise(resolve => {
      const interval = setInterval(() => getExpressions(), 500);
      setTimeout(() => {
        clearInterval(interval);
        const summary = summarizeExpressions(expressionHistory);
        resolve(summary);
      }, duration);
    });
  }

  function startContinuousExpressionTracking() {
    if (trackingInterval) clearInterval(trackingInterval);
    trackingInterval = setInterval(() => getExpressions(), 500);
  }

  onMount(async () => {
    await loadModels();
    await startVideo();

    videoElement.addEventListener("play", () => {
      overlayCanvas.width = videoElement.videoWidth;
      overlayCanvas.height = videoElement.videoHeight;
    });

    setInterval(drawLandmarks, 80);
    startContinuousExpressionTracking();
  });

  export {
    collectExpressions,
    startContinuousExpressionTracking,
    formatExpressionsPrompt
  };
</script>

<main>
  <div class="face-wrapper">
    <div class="video-container">
      <!-- svelte-ignore a11y-media-has-caption -->
      <video bind:this={videoElement} autoplay playsinline></video>
      <canvas bind:this={overlayCanvas}></canvas>
    </div>

    <div class="expression-box">
      {#if detections}
        <ul class="emotion-list">
          {#each getTopExpressions(detections) as [expression, score]}
            <li class="emotion">{expression}: {(score * 100).toFixed(0)}%</li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</main>
<style>
    .face-wrapper {
        width: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .video-container,
    .expression-box {
        height: auto;
        min-height: 5rem;
        border: 2px solid #666;
        object-fit: contain;
        text-align: center;
    }

    .video-container {
        position: relative;
        width: 300px;
        border-radius: 12px 12px 0 0;
        aspect-ratio: 4 / 3;
        box-sizing: border-box;
    }

    .expression-box {
        width: 100%;
        max-height: 40px;
        background: rgba(0 0 0 / 0.75);
        color: white;
        font-family: monospace;
        font-size: 0.85rem;
        line-height: 1;
        text-align: center;
        border-radius: 0 0 12px 12px;
        padding: 0.5rem 1rem;
        overflow: hidden;
        white-space: nowrap;
        box-sizing: border-box;
    }

    .video-container video,
    .video-container canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: auto;
        border-radius: 12px 12px 0 0;
    }

    .emotion-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 1rem;
        list-style: none;
        justify-content: center;
        padding: 0;
        margin: 0;
    }

    .emotion {
        flex: 0 0 45%;
        white-space: nowrap;
        text-align: center;
    }

</style>
