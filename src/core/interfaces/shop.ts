import type { Item } from "../items/Item";

export interface Shop {
    goods: Item[];
    lastUpdateTime: number;
}

// export interface ShopItem {
//     price: number;
//     displanName: string;
//     item: Item;
// }