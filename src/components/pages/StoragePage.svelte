<script lang="ts">
    import { getProfile, getProfileChangedEventDispatcher } from "../../core/game";
    import ItemCard from ".././items/ItemCard.svelte";
    import { getContext, onDestroy } from "svelte";
    import { KEY_PUT_HOLDINTG_ITEM_TO_STORAGE, KEY_TAKE_ITEM_FROM_STORAGE } from "../../keys";
    import type { Item } from "../../core/items/Item";

    const putHoldingItemToStorage: () => void = getContext(KEY_PUT_HOLDINTG_ITEM_TO_STORAGE);
    const takeItemFromStorage: (storageIndex: number) => void = getContext(KEY_TAKE_ITEM_FROM_STORAGE);

    let storage: Item[] = getProfile().storage;

    onDestroy(getProfileChangedEventDispatcher().on((profile) => (storage = profile.storage)));

    function onMouseUp() {
        putHoldingItemToStorage();
    }
</script>

<main on:mouseup={onMouseUp}>
    <header>
        {#if storage.length > 0}
            <span>点击物品转移到小推车：</span>
        {:else}
            <span>仓库空空如也</span>
        {/if}
    </header>

    <div class="content">
        <div class="items">
            {#each storage as item, index}
                <div class="item">
                    <ItemCard {item} on:click={() => takeItemFromStorage(index)} />
                </div>
            {/each}
            <div />
        </div>
    </div>
</main>

<style>
    :root {
        --primary-color: #ff6c29;
        --secondary-color: #ff641c;
    }

    main {
        width: 100%;
        height: 100%;
        background-color: #efefef;
        display: flex;
        flex-direction: column;
    }

    header {
        padding: 1em;
    }

    .content {
        width: 100%;
        flex: 1;
        overflow-y: auto;
    }

    .items {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .item {
        width: fit-content;
        height: fit-content;
    }
</style>
