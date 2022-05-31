<script lang="ts">
    import type { Item } from "../../core/interfaces/item";
    import { getItemRenderer } from "./item-renders";

    export let item: Item;
    export let selected: boolean = false;
    // export let showPrice: boolean = true;
</script>

<div
    class="ItemCard"
    class:selected
    on:click
    on:mousedown
    on:mousemove
    on:mouseup
    on:mouseleave
>
    <svelte:component this={getItemRenderer(item.id)} {item} />
    <div class="amount"><span>{item.amount}</span></div>
</div>

<style>
    .ItemCard {
        width: 10em;
        height: 5em;
        flex-shrink: 0;
        margin: 1em;
        padding: 1em;
        border-radius: 0.5em;
        border-width: 0;
        box-shadow: #80808080 0 0.1em 0.2em;
        background-color: #ffffff;
        position: relative;
        cursor: pointer;
    }

    .amount {
        position: absolute;
        right: 0;
        top: 0;
        width: 1.5em;
        height: 1.5em;
        box-shadow: #80808080 0 0.1em 0.2em;
        background-color: #ffffff;
        border-radius: 2em;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translate(50%, -50%);
        color: #000000;
    }

    .ItemCard.selected,
    .ItemCard.selected .amount {
        background-color: var(--primary-color);
        color: #ffffff;
    }
</style>
