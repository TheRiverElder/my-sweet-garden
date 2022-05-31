import { GeneBasedGrowStrategy } from "../core/grow-strategies/GeneBasedGrowStrategy";
import { createArray } from "../utils/arrays";
import { rand } from "../utils/math";

export function createGrowStrategy() {
    const gene: number[][][] = createArray(3, () => createArray(4, () => createArray(5, () => rand(-0.1, 0.1))));
    return new GeneBasedGrowStrategy(gene);
}