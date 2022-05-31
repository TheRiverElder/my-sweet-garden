import type Vec2 from "vec2";
import { ObjectType } from "../../utils/ObjectType";
import type { Plant } from "../plants/Plant";

export interface PlantPart<TPart extends PlantPart<any>> {
    prev: PlantPart<any> | null;
    type: PlantPartType<TPart>;
    pos: Vec2;

    getChildren(): PlantPart<any>[];
    tick(plant: Plant): void; // 执行生长相关操作
    // applyGene(plant: Plant, args: number[]): void; // 执行生长相关操作，应用基因操作的结果
    update(): void; // 更新位置之类的信息
    render(g: CanvasRenderingContext2D): void;
}

export class PlantPartType<TPart extends PlantPart<any>> extends ObjectType<TPart> {
    
    num: number;

    constructor(supplier: () => TPart, num: number) {
        super(supplier);
        this.num = num;
    }
}