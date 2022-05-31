<script lang="ts">
    import type { Profile } from "../../core/interfaces/profile";
    import {
        convertGameTimeToDate,
        getProfile,
        getProfileChangedEventDispatcher,
    } from "../../core/game";
    import { onDestroy } from "svelte";

    let profile: Profile = getProfile();

    onDestroy(getProfileChangedEventDispatcher().on((p) => (profile = p)));
</script>

<main>
    <header>个人信息：</header>

    <div>
        <p>
            游戏时间：{convertGameTimeToDate(profile.time).toLocaleString()}
        </p>
        <p>商店商品数量：{profile.shop.goods.length}</p>
        <p>花园植物数量：{profile.garden.length}</p>
        <p>仓库物品数量：{profile.storage.length}</p>
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
</style>
