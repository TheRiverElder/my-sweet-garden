<script lang="ts">
    import { onMount } from "svelte";
    import { getProfile } from "../../core/game";
    import { geneToText, textToGene } from "../../core/gene/GeneText";
    import type { Plant } from "../../core/plants/Plant";

    let plants: Plant[] = [];

    function refreshPlantList() {
        plants = getProfile().garden.slice();
    }

    onMount(refreshPlantList);
    let geneText: string = "";

    function choosePlant(index: number) {
        const currentPlant = plants[index] || null;
        console.log(plants, index, currentPlant);
        if (currentPlant) {
            geneText = geneToText(currentPlant.gene);
            console.log(geneText);
        }
    }

    function makePlant() {
        const gene = textToGene(geneText);
        console.log(gene);
    }
</script>

<div>
    <div>
        {#each plants as plant, i}
            <p on:click={() => choosePlant(i)}>{i}: {plant.nutrition}/{plant.moisture}/{plant.temperature}</p>
        {/each}
    </div>

    <button on:click={makePlant}>做种</button>

    <textarea bind:value={geneText} />
</div>

<style>
    textarea {
        font-family: Consolas;
    }
</style>
