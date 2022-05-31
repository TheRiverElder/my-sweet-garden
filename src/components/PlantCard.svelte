<script lang="ts">
    import { convertAgeToDate } from "../core/game";
    import { toLocaleAgeString } from "../utils/times";
    import PlantDisplay from "./PlantDisplay.svelte";
    import { createEventDispatcher } from "svelte";
    import type { Plant } from "../core/plants/Plant";

    export let plant: Plant;

    const dispatchTake = createEventDispatcher();
</script>

<div class="PlantCard">
    <div class="display-wrapper">
        <PlantDisplay bind:plant />
    </div>

    <div class="info">
        <table>
            <tr>
                <td>年龄：</td>
                <td>{toLocaleAgeString(convertAgeToDate(plant.age).getTime())}</td>
            </tr>
            <tr>
                <td>养料：</td>
                <td>{plant.nutrition.toFixed(2)}</td>
            </tr>
            <tr>
                <td>湿度：</td>
                <td>{plant.moisture.toFixed(2)}</td>
            </tr>
            <tr>
                <td>温度：</td>
                <td>{plant.temperature.toFixed(2)}</td>
            </tr>
        </table>
    </div>

    <div class="button-bar">
        <button class="btn-take" on:click={() => dispatchTake("take")}>收起</button>
    </div>
</div>

<style>
    :root {
        --primary-color: #ff6c29;
        --secondary-color: #ff641c;
    }

    .PlantCard {
        width: 100%;
        height: 100%;
        padding: 1em;
        display: flex;
        flex-direction: column;
    }

    .display-wrapper,
    .info {
        width: 100%;
    }

    .info > table {
        width: 100%;
    }

    .info > table > tr {
        width: 100%;
    }

    .info > table > tr > td:nth-child(2) {
        text-align: right;
    }

    .display-wrapper {
        flex: 1;
        overflow: hidden;
    }

    .button-bar {
        padding: 1em;
    }

    .btn-take {
        border-radius: 0.2em;
        padding: 0.5em 1em;
        background-color: #c0c0c0;
        color: #808080;
        cursor: pointer;
        transition: all ease-in-out 200ms;
    }

    .btn-take:hover {
        background-color: var(--secondary-color);
        color: #ffffff;
        transform: scale(1.1);
    }
</style>
