import Vec2 from "vec2";
import { constraints, HALF_PI, makePolarFourierCurve, rand, randInt, TWO_PI } from "../../utils/math";
import type { Plant } from "../plants/Plant";
import { REGISTRIES } from "../registries";
import { Flower } from "./Flower";
import { Leaf } from "./Leaf";
import { PlantPart, PlantPartType } from "./PlantPart";

export interface BranchProps {
    prev?: PlantPart<any> | null;
    pos?: Vec2;
    angle?: number; // 角度
    length?: number; // 长度
    width?: number; // 直径
    next?: (Branch | Flower | Leaf)[];
}

export const END_CHILD_TYPES = [Flower.TYPE, Leaf.TYPE];

export class Branch implements PlantPart<Branch> {
    public static readonly TYPE: PlantPartType<Branch> = new PlantPartType(() => new Branch({}), 1);

    prev: PlantPart<any> | null = null;
    type = Branch.TYPE;
    pos: Vec2;
    angle: number; // 角度
    length: number; // 长度
    width: number; // 直径
    next: (Branch | Flower | Leaf)[];

    constructor(props: BranchProps) {
        this.prev = props.prev || null;
        this.pos = props.pos || new Vec2(0, 0);
        this.angle = props.angle || 0;
        this.length = props.length || 0;
        this.width = props.width || 0;
        this.next = props.next || [];
    }

    getChildren(): PlantPart<any>[] {
        return this.next.slice();
    }

    tick(plant: Plant): void {
        plant.consumeEnergy(plant.consumeWater(this.length * 0.15, this), this);

        const gene = plant.gene;
        const totalLimit = gene[1];
        const branchLimitFactor = plant.gene[3];

        const totalPosition = Math.abs(this.pos.y) + this.length;
        const partLimit = constraints(-(totalPosition / totalLimit) + 1, 0, 1) * branchLimitFactor;
        
        let [growLength, nextPartType, nextBranchAngle] = plant.growStrategy.grow([
            plant.age, 
            this.type.num, 
            this.pos.y, 
            this.length, 
            this.next.length, 
            this.next.filter(p => END_CHILD_TYPES.includes(p.type as any)).length,
        ]);
        // console.table([{ growLength, nextPartType, nextBranchAngle }]);

        let growWidth = 0;
        growWidth = growLength * 0.005;

        // if (this.length < partLimit) {
        //     growLength = (1 / (50 * (this.length / partLimit + 1)) + 0.01) * (partLimit - this.length);
        //     if (this.next.filter(p => END_CHILD_TYPES.includes(p.type)).length === 0 && this.length < partLimit) {
        //         nextPartType = rand(0, 1 / (0.5 * this.next.length + 1));
        //     }
        //     // if (totalPosition / 500 < 0.12) {
        //     //     nextPartType = nextPartType * 0.5 + 0.3;
        //     // }
        //     nextPartType = Math.sin((constraints(totalPosition / totalLimit, 0, 1) - 0.5) * Math.PI) / 2 + 0.5;
        // }
        // // if (this.length === 1) {
        // //     console.table({totalPosition, partLimit, growLength});
        // // }
        // if (this.next.length >= 3) {
        //     nextPartType = 0;
        // }

        this.length += plant.consumeNutrition(growLength * this.width, this);
        this.width += plant.consumeNutrition(growWidth * this.length, this);

        const nextPartTypeNum = Math.floor(nextPartType);

        if (nextPartTypeNum > 0) {
            const nextType = REGISTRIES.PLANT_PART_NUMBER.get(nextPartTypeNum);
            if (nextType) {
                const child: PlantPart<any> = nextType.create();
                child.prev = this;
                if (nextType === Leaf.TYPE || nextType === Branch.TYPE || nextType === Flower.TYPE) {
                    const n = child as (Branch | Flower | Leaf);
                    n.angle = nextBranchAngle;
                    this.next.push(n);
                }
            }
        }

        // console.table(nextPartType);
        // if (nextPartType > 0.85) {
        //     const next: Flower = new Flower({
        //         prev: this,
        //         angle: nextBranchAngle,
        //         pieceCount: gene[9],
        //         pieceAngle: rand(0.1, 2 - 0.1) * Math.PI,
        //         sampleCount: 32,
        //         curve: makePolarFourierCurve(gene.slice(gene[11], gene[11] + gene[12]), TWO_PI),
        //         outterRadius: 1,
        //         innerRadius: 0.3,
        //         color: 0xff8080,
        //     });
        //     this.next.push(next);
        // } else if (nextPartType > 0.05) {
        //     const next: Leaf = new Leaf({
        //         prev: this,
        //         length: 1,
        //         angle: nextBranchAngle,
        //         sampleCount: 64,
        //         curve: makePolarFourierCurve(gene.slice(gene[7], gene[7] + gene[8]), TWO_PI),
        //     });
        //     this.next.push(next);
        // } else if (nextPartType > 0.01) {
        //     const next: Branch = new Branch({
        //         prev: this,
        //         angle: nextBranchAngle,
        //         length: 1,
        //         width: 1,
        //     });
        //     this.next.push(next);
        // }
    }

    update(): void {
        const nextPos = new Vec2(this.pos.x + this.length * Math.cos(this.angle), this.pos.y + this.length * Math.sin(this.angle));
        this.next.forEach(p => p.pos.set(nextPos.x, nextPos.y, false));
    }

    render(g: CanvasRenderingContext2D): void {
        g.strokeStyle = "#000000";
        g.lineJoin = "round";
        g.lineCap = "round";
        g.lineWidth = this.width;
        g.beginPath();
        g.moveTo(this.pos.x, this.pos.y);
        g.lineTo(this.pos.x + this.length * Math.cos(this.angle), this.pos.y + this.length * Math.sin(this.angle));
        g.stroke();
    }
}