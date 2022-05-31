<script lang="ts">
    import type { Item } from "../../core/items/Item";

    export let item: Item;
</script>

<div>
    <span class="name">{item.name}</span>
    <span class="price">￥{item.price}</span>
    <!-- <span class="id">{item.id}</span> -->
</div>

<style>
    div {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .name {
        position: absolute;
        left: 1em;
        top: 1em;
        font-family: "黑体";
        font-weight: bold;
    }

    /* .id {
        position: absolute;
        left: 1em;
        bottom: 0.5em;
        font-family: "黑体";
        font-style: italic;
        color: #808080;
        font-size: small;
    } */

    .price {
        position: absolute;
        bottom: 1em;
        right: 1em;
        font-family: "Courier New", Courier, monospace;
    }
</style>
