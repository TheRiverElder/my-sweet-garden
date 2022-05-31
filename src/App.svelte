<script lang="ts">
	import routes from "./routes";
	import Router, { push, location } from "svelte-spa-router";
	import { getProfile, getProfileChangedEventDispatcher, getTicker } from "./core/game";
	import { onDestroy, onMount, setContext } from "svelte";
	import CargoWidget from "./components/CargoWidget.svelte";
	import {
		KEY_HOLD_ITEM,
		KEY_PUT_HOLDINTG_ITEM_TO_STORAGE,
		KEY_TAKE_ITEM_FROM_STORAGE,
		KEY_TAKE_PLANT_FROM_GARDEN,
		KEY_USE_HOLDINTG_ITEM,
		KEY_USE_HOLDINTG_ITEM_AT,
	} from "./keys";
	import ItemCard from "./components/items/ItemCard.svelte";
	import Vec2 from "vec2";
	import type { Plant } from "./core/plants/Plant";
	import { PlantItem } from "./core/items/PlantItem";

	const pages = [
		{ name: "商店", path: "/shop" },
		{ name: "花园", path: "/garden" },
		{ name: "仓库", path: "/storage" },
		{ name: "我的", path: "/profile" },
		{ name: "实验", path: "/lab" },
		{ name: "测试", path: "/test" },
	];

	const ticker = getTicker();

	onMount(() => ticker.start());
	onDestroy(() => ticker.stop());

	let holdingCargoItemIndex: number = -1;

	function holdItem(cargoItemIndex: number) {
		holdingCargoItemIndex = cargoItemIndex;
		used = false;
	}

	let used: boolean = true;

	function useHoldingItem() {
		if (holdingCargoItemIndex < 0 || used) return;
		const profile = getProfile();
		const holdingItem = profile.cargo[holdingCargoItemIndex];

		holdingItem.use();
		const consumed = holdingItem.amount <= 0;

		used = true;
		if (consumed) {
			profile.cargo.splice(holdingCargoItemIndex, 1);
		}
		holdingCargoItemIndex = -1;
		getProfileChangedEventDispatcher().emit(profile);
	}

	function useHoldingItemAt(plant: Plant) {
		if (holdingCargoItemIndex < 0 || used) return;
		const profile = getProfile();
		const holdingItem = profile.cargo[holdingCargoItemIndex];

		holdingItem.useAtPlant(plant);
		const consumed = holdingItem.amount <= 0;

		used = true;
		if (consumed) {
			profile.cargo.splice(holdingCargoItemIndex, 1);
		}
		holdingCargoItemIndex = -1;
		getProfileChangedEventDispatcher().emit(profile);
	}

	function putHoldingItemToStorage() {
		if (holdingCargoItemIndex < 0 || used) return;
		const profile = getProfile();
		const [item] = profile.cargo.splice(holdingCargoItemIndex, 1);

		profile.storage.unshift(item);

		used = true;
		holdingCargoItemIndex = -1;
		getProfileChangedEventDispatcher().emit(profile);
	}

	function takeItemFromStorage(storageIndex: number) {
		const profile = getProfile();
		const [item] = profile.storage.splice(storageIndex, 1);
		profile.cargo.unshift(item);
		getProfileChangedEventDispatcher().emit(profile);
	}

	function takePlantFromGarden(gardenIndex: number) {
		const profile = getProfile();
		const [plant] = profile.garden.splice(gardenIndex, 1);
		const item: PlantItem = new PlantItem({
			name: `植株-${plant.age}`,
			price: 0, // to judge
			amount: 1,
			plant: plant,
		});
		profile.cargo.unshift(item);
		getProfileChangedEventDispatcher().emit(profile);
	}

	setContext(KEY_HOLD_ITEM, holdItem);
	setContext(KEY_USE_HOLDINTG_ITEM, useHoldingItem);
	setContext(KEY_USE_HOLDINTG_ITEM_AT, useHoldingItemAt);
	setContext(KEY_PUT_HOLDINTG_ITEM_TO_STORAGE, putHoldingItemToStorage);
	setContext(KEY_TAKE_ITEM_FROM_STORAGE, takeItemFromStorage);
	setContext(KEY_TAKE_PLANT_FROM_GARDEN, takePlantFromGarden);

	let pageDOM: HTMLElement;
	let holdingItemWrapperStyle: string = ``;

	function onMouseMove(event: MouseEvent) {
		if (holdingCargoItemIndex < 0) return;
		const clientMousePosition = new Vec2(event.clientX, event.clientY);
		const pageRect = pageDOM.getBoundingClientRect();
		const clientPagePosition = new Vec2(pageRect.x, pageRect.y);
		const position = clientMousePosition.subtract(clientPagePosition);
		holdingItemWrapperStyle = `
			left: ${position.x}px;
			top: ${position.y}px;
		`;
	}

	function onMouseUp() {
		holdingCargoItemIndex = -1;
		used = true;
	}
</script>

<main class:heldItem={holdingCargoItemIndex >= 0} bind:this={pageDOM} on:mousemove={onMouseMove} on:mouseup={onMouseUp}>
	<header>
		{#each pages as page}
			<div class="page-tab" class:disabled={page.path === $location} on:click={() => push(page.path)}>
				<span>{page.name}</span>
			</div>
		{/each}
	</header>

	<div class="content">
		<Router {routes} />
	</div>

	<CargoWidget />

	{#if holdingCargoItemIndex >= 0}
		<div class="holding-item-wrapper" style={holdingItemWrapperStyle}>
			<ItemCard item={getProfile().cargo[holdingCargoItemIndex]} selected />
		</div>
	{/if}
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		position: relative;
		background-color: #efefef;
		display: flex;
		flex-direction: column;
		overflow-y: hidden;
	}

	main.heldItem {
		user-select: none;
	}

	header {
		widows: 100%;
		height: 3em;
		padding: 0 3em;
		background-color: #202230;
		display: flex;
		flex-direction: row;
	}

	.page-tab {
		width: 5em;
		height: 100%;
		margin-left: 0.2em;
		background-color: #404461;
		color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	.page-tab.disabled {
		background-color: #efefef;
		color: #202230;
		cursor: auto;
	}

	.content {
		width: 100%;
		flex: 1;
		overflow: hidden;
	}

	.holding-item-wrapper {
		position: absolute;
		transform: translate(-50%, -50%);
		opacity: 0.5;
		pointer-events: none;
	}
</style>
