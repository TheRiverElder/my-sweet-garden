import type { Item } from "../items/Item";
import type { Plant } from "../plants/Plant";
import type { Shop } from "./shop";

export interface Profile {
    account: number;
    time: number;
    garden: Plant[];
    shop: Shop;
    storage: Item[];
    cargo: Item[];
}