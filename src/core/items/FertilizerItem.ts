import { constraints } from "../../utils/math";
import type { Plant } from "../plants/Plant";
import { Item, ItemType } from "./Item";

export interface FertilizerItemProps {
    name?: string;
    price?: number;
    amount?: number;
    nutrition?: number;
}


export class FertilizerItem implements Item {
    public static readonly TYPE = new ItemType(() => new FertilizerItem({}));

    type: ItemType;
    name: string;
    price: number;
    amount: number;
    nutrition: number;

    constructor(props: FertilizerItemProps) {
        this.name = props.name || "fertilizer_item";
        this.price = props.price || 0;
        this.amount = props.amount || 0;
        this.nutrition = props.nutrition || 0;
    }

    use(): void {}
    
    useAtPlant(plant: Plant): void {
        const usedAmount = constraints(this.amount, 0, 1);
        plant.nutrition += usedAmount * this.nutrition;
        this.amount -= usedAmount;
    }

}