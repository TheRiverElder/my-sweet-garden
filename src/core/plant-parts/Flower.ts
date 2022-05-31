import Vec2 from "vec2";
import { createArray } from "../../utils/arrays";
import { calcSamplePoints, constraints, Curve, float, FN_0, int, TWO_PI } from "../../utils/math";
import type { Plant } from "../plants/Plant";
import { type PlantPart, PlantPartType } from "./PlantPart";

export interface FlowerProps {
    prev?: PlantPart<any> | null;
    pos?: Vec2;
    angle?: number; // 角度
    pieceCount?: int; // 有几片花瓣
    pieceAngle?: float; // 相邻花瓣的夹角
    sampleCount?: int; // 取样点数量
    curve?: Curve; // 轮廓曲线，返回数值在[0, 1]
    outterRadius?: number; // 外直径
    innerRadius?: number; // 内直径
    color?: int;
}

export class Flower implements PlantPart<Flower> {
    public static readonly TYPE: PlantPartType<Flower> = new PlantPartType<Flower>(() => new Flower({}), 3);
    
    prev: PlantPart<any> | null = null;
    type = Flower.TYPE;
    pos: Vec2 = new Vec2(0, 0);
    angle?: number; // 角度
    pieceCount: int; // 有几片花瓣
    pieceAngle: float; // 相邻花瓣的夹角
    sampleCount: int; // 取样点数量
    curve: Curve; // 轮廓曲线，返回数值在[0, 1]
    outterRadius: number; // 外直径
    innerRadius: number; // 内直径
    color: int;

    constructor(props: FlowerProps) {
        this.prev = props.prev || null;
        this.pos = props.pos || new Vec2(0, 0);
        this.angle = props.angle || 0;
        this.pieceCount = props.pieceCount || 0;
        this.pieceAngle = props.pieceAngle || 0;
        this.sampleCount = props.sampleCount || 0;
        this.curve = props.curve || FN_0;
        this.outterRadius = props.outterRadius || 0;
        this.innerRadius = props.innerRadius || 0;
        this.color = props.color || 0;
    }

    getChildren(): PlantPart<any>[] {
        return [];
    }
    
    tick(plant: Plant): void {
        plant.consumeEnergy(plant.consumeWater(this.outterRadius * 0.3, this), this);

        const r = this.innerRadius / this.outterRadius;
        const totalPosition = Math.abs(this.pos.y) + this.outterRadius;


        let [growLength, nextPartType, nextBranchAngle] = plant.growStrategy.grow([
            plant.age, 
            this.type.num, 
            this.pos.y, 
            this.outterRadius, 
            0, 
            0,
        ]);

        // if (this.outterRadius < partLimit) {
        //     growLength = (1 / (50 * (this.outterRadius / partLimit + 1)) + 0.01) * (partLimit - this.outterRadius);
        //     if (totalPosition / totalLimit < 0.12) {
        //         nextPartType = nextPartType * 0.5 + 0.2;
        //     }
        // }

        this.outterRadius += plant.consumeNutrition(growLength, this);
        this.innerRadius = r * this.outterRadius;
    }

    update(): void {
        
    }
    
    render(g: CanvasRenderingContext2D): void {
        g.fillStyle = number2color(this.color);
        g.strokeStyle = '#0000003f';
        g.lineWidth = 1;

        const { x, y } = this.pos;

        const samplePoints = calcSamplePoints(this.curve, this.sampleCount, 0, TWO_PI, false);
        const deltaRadius = (this.outterRadius - this.innerRadius) / this.pieceCount;
        for (let i = this.pieceCount; i > 0; i--) {
            const radius = (this.innerRadius + i * deltaRadius);
            g.beginPath();
            g.moveTo(x, y);
            for (const { x: dx, y: dy } of samplePoints) {
                const a = this.angle + dx + i * this.pieceAngle;
                const r = radius * dy;
                const px = x + r * Math.cos(a);
                const py = y + r * Math.sin(a);
                g.lineTo(px, py);
            }
            g.closePath();
            g.fill();
            g.stroke();
        }

        g.beginPath();
        g.arc(x, y, this.innerRadius, 0, 2 * Math.PI);
        g.closePath();
        g.fill();
        g.stroke();
    }
}

function number2color(num: number) {
    return '#' + createArray(3, i => ((num >>> (i * 8)) & 0xff).toString(16).padStart(2, '0')).reverse().join('');
}