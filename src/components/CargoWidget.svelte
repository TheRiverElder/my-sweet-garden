<script lang="ts">
    import { getContext, onDestroy } from "svelte";

    import { getProfile, getProfileChangedEventDispatcher } from "../core/game";
    import type { Item } from "../core/interfaces/item";
    import { KEY_HOLD_ITEM } from "../keys";
    import ItemCard from "./items/ItemCard.svelte";

    // export let holdingItemIndex: number;

    const holdItem: (index: number) => void = getContext(KEY_HOLD_ITEM);

    let cargo: Item[] = getProfile().cargo;
    let collapsed: boolean = true;
    let selectedIndex: number = -1;

    function toggleSelected(index: number) {
        if (selectedIndex !== index) {
            selectedIndex = index;
        } else {
            selectedIndex = -1;
        }
    }

    onDestroy(
        getProfileChangedEventDispatcher().on(
            (profile) => (cargo = profile.cargo)
        )
    );

    let cargoItemHeld = false;
    function onMouseMove(index: number) {
        if (cargoItemHeld) {
            holdItem(index);
        }
    }
</script>

<div class="CargoWidget" class:collapsed>
    <div class="items">
        {#each cargo as item, index}
            <ItemCard
                {item}
                selected={selectedIndex === index}
                on:click={() => toggleSelected(index)}
                on:mousedown={() => (cargoItemHeld = true)}
                on:mouseup={() => (cargoItemHeld = false)}
                on:mouseleave={() => (cargoItemHeld = false)}
                on:mousemove={() => onMouseMove(index)}
            />
        {/each}
        {#if cargo.length <= 0}
            <span class="hint">小推车空空如也</span>
        {/if}
    </div>
    <div class="toggle-button" on:click={() => (collapsed = !collapsed)}>
        <div class="circle" />
    </div>
</div>

<style>
    .CargoWidget {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ffffffc0;
        border-top: #ffffff solid;
    }

    .toggle-button {
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: #ffffff80;
        width: 2em;
        height: 2em;
        border-top-right-radius: 10em;
        border-top-width: 0.1em;
        border-right-width: 0.1em;
        border-left-width: 0;
        border-bottom-width: 0;
        border-color: #696c7a;
        border-style: solid;
    }

    .toggle-button > .circle {
        width: 1em;
        height: 1em;
        border: #696c7a solid 0.1em;
        border-radius: 1em;
        position: absolute;
        left: 0.2em;
        bottom: 0.2em;
    }

    .items {
        height: 10em;
        transition: height ease-in-out 200ms;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .CargoWidget.collapsed > .items {
        height: 0em;
    }

    .hint {
        margin-left: 2em;
        font-style: italic;
        color: #696c7a;
    }
</style>
