import Vec2 from "vec2";
import { calcSamplePoints, constraints, Curve, FN_0, TWO_PI } from "../../utils/math";
import type { Plant } from "../plants/Plant";
import { type PlantPart, PlantPartType } from "./PlantPart";

export interface LeafProps {
    prev?: PlantPart<any> | null;
    pos?: Vec2;
    angle?: number; // 角度
    sampleCount?: number; // 取样点数量
    curve?: Curve; // 轮廓曲线，返回数值在[0, 1]
    length?: number; // 长度
}

export class Leaf implements PlantPart<Leaf> {
    public static readonly TYPE: PlantPartType<Leaf> = new PlantPartType(() => new Leaf({}), 2);
    
    prev: PlantPart<any> | null = null;
    type = Leaf.TYPE;
    pos: Vec2;
    angle: number; // 角度
    sampleCount: number; // 取样点数量
    curve: Curve; // 轮廓曲线，返回数值在[0, 1]
    length: number; // 长度

    constructor(props: LeafProps) {
        this.prev = props.prev || null;
        this.pos = props.pos || new Vec2(0, 0);
        this.angle = props.angle || 0;
        this.sampleCount = props.sampleCount || 0;
        this.curve = props.curve || FN_0;
        this.length = props.length || 0;
    }

    getChildren(): PlantPart<any>[] {
        return [];
    }
    
    tick(plant: Plant): void {
        plant.consumeEnergy(plant.consumeWater(this.length * 0.2, this), this);
        plant.energy += plant.consumeWater(this.length, this) * 1.2;

        const totalPosition = Math.abs(this.pos.y) + this.length;

        let [growLength, nextPartType, nextBranchAngle] = plant.growStrategy.grow([
            plant.age, 
            this.type.num,
            this.pos.y, 
            this.length, 
            0, 
            0,
        ]);

        // if (this.length < partLimit) {
        //     growLength = (1 / (50 * (this.length / partLimit + 1)) + 0.01) * (partLimit - this.length);
        //     if (totalPosition / 500 < 0.12) {
        //         nextPartType = nextPartType * 0.5 + 0.2;
        //     }
        // }

        this.length += plant.consumeNutrition(growLength, this);
    }

    applyGene(plant: Plant, [growLength, nextPartType, nextBranchAngle]): void {
        this.length += growLength * plant.consumeNutrition(growLength, this);
    }

    update(): void {
        
    }
    
    render(g: CanvasRenderingContext2D): void {
        g.fillStyle = '#00aa00';
        g.strokeStyle = '#0000003f';
        g.lineWidth = 1;

        const { x, y } = this.pos;

        const samplePoints = calcSamplePoints(this.curve, this.sampleCount, 0, TWO_PI, false);

        g.beginPath();
        for (const { x: dx, y: dy } of samplePoints) {
            const a = dx + this.angle;
            const r = this.length * dy;
            g.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
        }
        g.closePath();
        g.fill();
        g.stroke();
    }
}