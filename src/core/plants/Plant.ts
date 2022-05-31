import { constraints, rand } from "../../utils/math";
import { GeneBasedGrowStrategy } from "../grow-strategies/GeneBasedGrowStrategy";
import type { GrowStrategy } from "../grow-strategies/GrowStrategy";
import type { PlantPart } from "../plant-parts/PlantPart";
import { Seed } from "../plant-parts/Seed";
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
export interface PlantProps {
    body?: Seed;
    gene?: number[]; 
    age?: number;
    nutrition?: number;
    energy?: number;
    water?: number;
    moisture?: number;
    temperature?: number;
}

export class Plant {
    body: Seed;
    gene: number[];
    age: number;
    nutrition: number;
    energy: number;
    water: number;
    moisture: number;
    temperature: number;
    growStrategy: GrowStrategy;

    constructor(props: PlantProps) {
        this.body = props.body || Seed.TYPE.create();
        this.gene = props.gene || [];
        this.age = props.age || 0;
        this.nutrition = props.nutrition || 0;
        this.energy = props.energy || 0;
        this.water = props.water || 0;
        this.moisture = props.moisture || 0;
        this.temperature = props.temperature || 0;

        this.growStrategy = GeneBasedGrowStrategy.fromGene(this.gene);
    }

    private lastTickPartCount = 1;

    // 返回消耗的养料
    consumeNutrition(amount: number, consumer: PlantPart<any>): number {
        const consumed = constraints(amount, 0, this.nutrition * 0.618) * 0.618;
        this.nutrition -= consumed;
        return consumed;
    }

    // 返回消耗的能量
    consumeEnergy(amount: number, consumer: PlantPart<any>): number {
        const consumed = constraints(amount, 0, this.energy * 0.618) * 0.618;
        this.energy -= consumed;
        return consumed;
    }

    // 返回消耗的水
    consumeWater(amount: number, consumer: PlantPart<any>): number {
        const consumed = constraints(amount, 0, this.water * 0.618) * 0.618;
        this.water -= consumed;
        return consumed;
    }

    forEachParts(fn: (part: PlantPart<any>) => void) {
        const queue: PlantPart<any>[] = [this.body];
        while (queue.length) {
            const part = queue.shift();
            queue.push(...part.getChildren());
            fn(part);
        }
    }

    everyParts(fn: (part: PlantPart<any>) => boolean) {
        const queue: PlantPart<any>[] = [this.body];
        while (queue.length) {
            const part = queue.shift();
            queue.push(...part.getChildren());
            if (!fn(part)) return false;
        }
        return true;
    }

    someParts(fn: (part: PlantPart<any>) => boolean) {
        const queue: PlantPart<any>[] = [this.body];
        while (queue.length) {
            const part = queue.shift();
            queue.push(...part.getChildren());
            if (fn(part)) return true;
        }
        return false;
    }

    tick() {
        // const strategy: GeneBasedGrowStrategy = GeneBasedGrowStrategy.fromGene(this.gene);

        this.age++;
        let partCount = 0;
        const chanceToTickPart = FN_TICK_PART_RATIO(this.lastTickPartCount);

        this.forEachParts(part => {
            partCount++;
            if (rand(0, 1) < chanceToTickPart) {
                part.tick(this);
            }
            part.update();
        });

        this.lastTickPartCount = Math.max(1, partCount);
    }
}

const MIN_TICK_PART_RATIO = 0.01; 
const FN_TICK_PART_RATIO = (x: number) => (1 - MIN_TICK_PART_RATIO) / (x + 1) + MIN_TICK_PART_RATIO;

const PLANT_PART_NUMBERS: { [key: string]: number } = {
    'seed': 1,
    'branch': 2,
    'leaf': 3,
    'flower': 4,
    'node': 5,
};