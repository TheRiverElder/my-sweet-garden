<script lang="ts">
    import type { Plant } from "../core/plants/Plant";
    import { REGISTRIES } from "../core/registries";

    export let plant: Plant;
    let canvas: HTMLCanvasElement;

    $: {
        if (canvas && plant) {
            REGISTRIES.PLANT_RENDERER.get("2d").render(canvas, plant);
        }
    }
</script>

<div>
    <canvas bind:this={canvas} />
</div>

<style>
    div,
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
