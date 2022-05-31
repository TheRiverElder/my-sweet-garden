import { getProfile } from "../game";
import { Plant } from "../plants/Plant";
import { Item, ItemType } from "./Item";

export interface PlantItemProps {
    name?: string;
    price?: number;
    amount?: number;
    plant?: Plant;
}


export class PlantItem implements Item {
    public static readonly TYPE = new ItemType(() => new PlantItem({}));

    type: ItemType;
    name: string;
    price: number;
    amount: number;
    plant: Plant;

    constructor(props: PlantItemProps) {
        this.name = props.name || "plant_item";
        this.price = props.price || 0;
        this.amount = props.amount || 0;
        this.plant = props.plant || new Plant({});
    }

    use(): void {
        getProfile().garden.push(this.plant);
        this.amount = 0;
    }

    useAtPlant(plant: Plant): void {
        this.use();
    }

}