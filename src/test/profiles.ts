import type { Profile } from "../core/interfaces/profile";
import { PlantItem } from "../core/items/PlantItem";
import { createArray } from "../utils/arrays";
import { genPlant } from "./plants";
import { genShop } from "./shops";

export function genProfile(): Profile {
    return {
        account: 1000,
        time: 0,
        garden: createArray(1, () => genPlant()),
        shop: genShop(),
        storage: createArray(1, () => genPlantItem()),
        cargo: createArray(1, () => genPlantItem()),
    };
}

function genPlantItem(): PlantItem {
    return new PlantItem({
        name: "小花花",
        price: 50,
        amount: 1,
        plant: genPlant(),
    });
}