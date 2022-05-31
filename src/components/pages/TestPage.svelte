<script lang="ts">
    import { onMount } from "svelte";
    import { geneToText, textToGene } from "../../core/gene/GeneText";
    import { Branch } from "../../core/plant-parts/Branch";
    import { Flower } from "../../core/plant-parts/Flower";
    import { Leaf } from "../../core/plant-parts/Leaf";
    import { Plant } from "../../core/plants/Plant";
    import { REGISTRIES } from "../../core/registries";
    import { genGene2, genPlant } from "../../test/plants";
    import { Ticker } from "../../utils/Ticker";

    let plant: Plant;
    let canvas: HTMLCanvasElement;
    let geneText: string = "";
    let statusText: string = "";
    let paused: boolean = false;

    function refresh(newPlant?: Plant) {
        // demostrateSimulationResult();
        plant = newPlant || makeSeed();
        geneText = geneToText(plant.gene);
        REGISTRIES.PLANT_RENDERER.get("2d").render(canvas, plant);
        ticker.start();
    }

    function simulateStep(plant: Plant) {
        plant.tick();
    }

    onMount(refresh);

    function grow() {
        console.log("grow", plant);
        simulateStep(plant);
        // const reason = checkValid(plant);
        // if (reason) {
        //     console.log('Failed: ', reason);
        //     refresh();
        // }
        REGISTRIES.PLANT_RENDERER.get("2d").render(canvas, plant);
        statusText = `
        元件计数: ${(plant as any).lastTickPartCount}
        年龄: ${plant.age}
        养料: ${plant.nutrition.toFixed(5)}
        能量: ${plant.energy.toFixed(5)}
        水分: ${plant.water.toFixed(5)}
        湿度: ${plant.moisture.toFixed(2)}
        温度: ${plant.temperature.toFixed(2)}
        `
            .trim()
            .replace(/\s*\r?\n\s*/g, "\n");
    }

    function tick() {
        if (!paused) {
            grow();
        }
    }

    const ticker = new Ticker(100);
    ticker.on(tick);

    function makeSeedAndRestart() {
        const newGene = textToGene(geneText);
        const newPlant = makeSeed(newGene);
        refresh(newPlant);
    }

    function makeRandomSeedAndRestart() {
        const newPlant = makeSeed(genGene2());
        refresh(newPlant);
    }

    function makeSeed(newGene?: number[]): Plant {
        newGene = newGene || genGene2();
        const newPlant = new Plant({
            nutrition: 100,
            water: 100,
            energy: 300,
            gene: newGene,
        });
        return newPlant;
    }

    function checkValid(plant: Plant): string | null {
        if (plant.nutrition < 1e-3 || plant.energy < 1e-3 || plant.water < 1e-3) return 'no suppliment';
        let hasLeaf = false;
        let reason: string | null = null;
        let res = plant.everyParts((part) => {
            if (part.type === Branch.TYPE) {
                const branch = part as Branch;
                if (branch.next.length > 3) {
                    reason = 'branch has too much children';
                    return false;
                }
                return true;
            } else if (part.type === Flower.TYPE || part.type === Leaf.TYPE) {
                if (part.type === Leaf.TYPE) {
                    hasLeaf = true;
                }
                if (part.prev.type === Branch.TYPE) {
                    const branch = part.prev as Branch;
                    if (branch.next.length != 1) {
                        reason = 'flower or leaf has siblings';
                        return false;
                    }
                }
                return true;
            } else return true;
        });
        if (!res) return reason;
        if (plant.age >= 10 && !hasLeaf) return 'no leaf in 10 ticks';
        return null;
    }
</script>

<div class="TestPage">
    <div class="left">
        <canvas bind:this={canvas} />
    </div>

    <div class="right">
        <div>
            <button on:click={makeRandomSeedAndRestart}>随机重置</button>
            <button on:click={makeSeedAndRestart}>做种重置</button>
            <button on:click={() => paused = !paused}>{paused ? '继续' : '暂停'}</button>
        </div>
        <textarea bind:value={statusText} />
        <textarea bind:value={geneText} />
    </div>
</div>

<style>
    div.TestPage {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
    }

    div.left {
        flex: 8;
        height: 100%;
    }

    canvas {
        width: 100%;
        height: 100%;
        background-color: #c0c0c0;
    }

    div.right {
        flex: 4;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    textarea {
        flex: 1;
        resize: none;
        overflow: auto;
    }
</style>
