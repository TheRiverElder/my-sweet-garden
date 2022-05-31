<script lang="ts">
import { onDestroy } from "svelte";

    import { getProfile, getProfileChangedEventDispatcher } from "../../core/game";
    import type { Shop } from "../../core/interfaces/shop";
    import { numberSort, numberSum } from "../../utils/arrays";
    import ItemCard from ".././items/ItemCard.svelte";
    import Spacer from ".././Spacer.svelte";

    let shop: Shop = getProfile().shop;
    let selectedIndecies: Set<number> = new Set();

    onDestroy(
        getProfileChangedEventDispatcher().on(
            (profile) => (shop = profile.shop)
        )
    );

    function toggleSelectingStatus(index: number) {
        if (selectedIndecies.has(index)) {
            selectedIndecies.delete(index);
        } else {
            selectedIndecies.add(index);
        }
        selectedIndecies = selectedIndecies;
    }

    function confirmPurchasement() {
        if (selectedIndecies.size === 0) {
            window.alert("购买失败：未选择任何商品。");
            return;
        }

        const profile = getProfile();

        const indecies = numberSort(
            Array.from(selectedIndecies.values())
        ).reverse();
        for (const index of indecies) {
            const [item] = shop.goods.splice(index, 1);
            // getProfile().garden.push(item);
            profile.cargo.unshift(item);
        }

        selectedIndecies = new Set();
        getProfileChangedEventDispatcher().emit(profile);
        window.alert("购买成功！");
    }
</script>

<main>
    <header>
        {#if shop.goods.length > 0}
            <span>请选择商品：</span>
        {:else}
            <span>商店空空如也</span>
        {/if}
    </header>

    <div class="content">


    <div class="goods">
        {#each shop.goods as item, index}
            <div
                class="shop-item"
                on:click={() => toggleSelectingStatus(index)}
            >
                <ItemCard {item} selected={selectedIndecies.has(index)} />
            </div>
        {/each}
        <div />
    </div>
    </div>

    <footer>
        <span class="hint">总共</span>
        <span class="count">{selectedIndecies.size}</span>
        <span class="hint">件商品 | 共计金额：</span>
        <span class="total-price">
            ￥{numberSum(
                Array.from(selectedIndecies.values()).map(
                    (index) => shop.goods[index].price
                )
            )}
        </span>
        <Spacer width="1em" />
        <button
            class="confirm-purchasement"
            disabled={selectedIndecies.size <= 0}
            on:click={() => confirmPurchasement()}>确认支付</button
        >
    </footer>
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
        overflow: hidden;
    }

    header {
        padding: 1em;
    }

    .content {
        width: 100%;
        flex: 1;
        overflow-y: auto;
    }

    .goods {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        flex-wrap: wrap;
    }
    
    .shop-item {
        width: fit-content;
        height: fit-content;
    }

    footer {
        width: 100%;
        height: 4em;
        background-color: #ffffff;
        box-shadow: #80808080 0 0 0.2em;
        padding: 0.8em 1em;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: baseline;
    }

    .hint {
        font-family: "黑体";
        font-weight: bold;
        font-size: large;
    }

    .total-price {
        min-width: 10em;
        font-size: large;
    }

    .confirm-purchasement {
        border-radius: 0.2em;
        padding: 0.5em 1em;
        background-color: var(--primary-color);
        color: #ffffff;
        cursor: pointer;
        transition: all ease-in-out 200ms;
    }

    .confirm-purchasement:hover {
        background-color: var(--secondary-color);
        transform: scale(1.1);
    }

    .confirm-purchasement:disabled {
        background-color: #c0c0c0;
        color: #808080;
        cursor: not-allowed;
    }

    .confirm-purchasement:disabled:hover {
        transform: none;
    }
</style>
