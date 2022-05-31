import { Regsitry } from "../utils/Registry";
import type { ItemType } from "./items/Item";
import type { PlantPartType } from "./plant-parts/PlantPart";
import type { PlantRenderer } from "./plant-renderers/PlantRenderer";

export const REGISTRIES = {
    PLANT_PART_TYPE: new Regsitry<string, PlantPartType<any>>(),
    PLANT_PART_NUMBER: new Regsitry<number, PlantPartType<any>>(),
    PLANT_RENDERER: new Regsitry<string, PlantRenderer>(),
    ITEM_TYPE: new Regsitry<string, ItemType>(),
};