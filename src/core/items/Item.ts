import { ObjectType } from "../../utils/ObjectType";
import type { Plant } from "../plants/Plant";

export interface Item {
    type: ItemType;
    name: string;
    price: number;
    amount: number;

    use(): void;
    useAtPlant(plant: Plant): void;

}

export class ItemType extends ObjectType<Item> {
    
}