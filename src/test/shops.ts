import type { Shop } from "../core/interfaces/shop";
import { FertilizerItem } from "../core/items/FertilizerItem";
import type { Item } from "../core/items/Item";
import { PlantItem } from "../core/items/PlantItem";
import { createArray } from "../utils/arrays";
import { Counter } from "../utils/Counter";
import { rand, randInt } from "../utils/math";
import { genPlant } from "./plants";

export function genShop(): Shop {
    return {
        goods: createArray(randInt(20, 150), () => genItem()),
        lastUpdateTime: Date.now(),
    };
}

const SHOP_ITEM_COUNTER = new Counter();

export function genItem(): Item {
    if (rand(0, 1) < 0.5) return genPlantItem();
    else return genFertilizerItem();
}


export function genPlantItem(): PlantItem {
    return new PlantItem({
        name: `幼苗盲盒-${SHOP_ITEM_COUNTER.getAndIncrement()}`,
        price: randInt(10, 20) * 10,
        amount: 1,
        plant: genPlant(),
    });
}

function genFertilizerItem(): FertilizerItem {
    return new FertilizerItem({
        name: `肥料-${SHOP_ITEM_COUNTER.getAndIncrement()}`,
        price: randInt(5, 15) * 10,
        amount: 1,
        nutrition: randInt(50, 100),
    });
}