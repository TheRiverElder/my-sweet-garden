import { Plant } from "../core/plants/Plant";
import { createArray } from "../utils/arrays";
import { rand, randInt } from "../utils/math";

export function genPlant(): Plant {
    return new Plant({
        gene: genGene2(),
        nutrition: 10000000,
        moisture: 50,
        temperature: 25,
    });
}

/*
    gene: [
        0: 占位, 
        1: totalLimit, 
        2: seed占位, 
        3: branchLimitFactor, 
        4: leafLimitFactor, 
        5: flowerLimitFactor, 
        6: leafColor, 7: leafShapeIndex, 8: leafShapeSize, 
        9: flowerPieceCount, 10: flowerColor, 11: flowerShapeIndex, 12: flowerShapeSize, 
        leafShapeIndex: ...LeafShape[leafShapeSize], 
        flowerShapeIndex: ...flowerShape[flowerShapeSize], 
    ]
*/
export function genGene1(): number[] {
    const gene: number[] = [];
    gene.push(0, 500, 0, 100, 10, 15);

    const leafShape = createArray(1 + 2 * randInt(1, 5), () => rand(0.8, 1));
    gene.push(0x00aa00, 0, leafShape.length);

    const flowerShape = createArray(1 + 2 * randInt(3, 7), () => rand(0.2, 1));
    gene.push(randInt(10, 25), randInt(0, 0x01000000), 0, flowerShape.length);

    gene[7] = gene.length;
    gene.push(...leafShape);
    gene[11] = gene.length;
    gene.push(...flowerShape);

    return gene;
}

export function genGene2(): number[] {
    return [3, 4, 4, 4]
        .concat(...createArray(4, () => createArray(7, () => rand(-0.2, 0.2))))
        .concat(createArray(2, () => createArray(4, () => createArray(5, () => rand(-0.2, 0.2)))).flat(3));
}