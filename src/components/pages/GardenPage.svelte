<script lang="ts">
    import { getContext, onDestroy } from "svelte";
    import { getProfile, getProfileChangedEventDispatcher } from "../../core/game";
    import type { Plant } from "../../core/plants/Plant";
    import { KEY_TAKE_PLANT_FROM_GARDEN, KEY_USE_HOLDINTG_ITEM, KEY_USE_HOLDINTG_ITEM_AT } from "../../keys";
    import PlantCard from "../PlantCard.svelte";

    const useHoldingItem: () => void = getContext(KEY_USE_HOLDINTG_ITEM);
    const useHoldingItemAt: (plant: Plant) => void = getContext(KEY_USE_HOLDINTG_ITEM_AT);
    const takePlantFromGarden: (index: number) => void = getContext(KEY_TAKE_PLANT_FROM_GARDEN);

    let plants = getProfile().garden;

    onDestroy(getProfileChangedEventDispatcher().on((profile) => (plants = profile.garden)));

    function onMouseUp() {
        useHoldingItem();
    }
</script>

<main on:mouseup={onMouseUp}>
    <div class="cards">
        {#each plants as plant, index}
            <div class="card" on:mouseup={() => useHoldingItemAt(plant)}>
                <PlantCard bind:plant on:take={() => takePlantFromGarden(index)} />
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        width: 100%;
        min-height: 100%;
        background-color: #efefef;
    }

    .cards {
        width: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: row;
    }

    .cards > .card {
        flex-shrink: 0;
        margin: 1em;
        width: 20em;
        height: 50em;
        border-radius: 0.5em;
        border-width: 0;
        box-shadow: #80808080 0 0.1em 0.2em;
        background-color: #ffffff;
        overflow: hidden;
    }
</style>
