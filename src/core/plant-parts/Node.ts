import Vec2 from "vec2";
import { constraints, TWO_PI } from "../../utils/math";
import type { Plant } from "../plants/Plant";
import { type PlantPart, PlantPartType } from "./PlantPart";

export interface LeafProps {
    prev?: PlantPart<any> | null;
    pos?: Vec2;
    angle?: number;
    radius?: number;
}

export class Node implements PlantPart<Node> {
    public static readonly TYPE = new PlantPartType(() => new Node({}), 4);
    
    prev: PlantPart<any> | null = null;
    type = Node.TYPE;
    pos: Vec2;
    angle: number;
    radius: number;
    next: PlantPart<any>[];

    constructor(props: LeafProps) {
        this.prev = props.prev || null;
        this.pos = props.pos || new Vec2(0, 0);
        this.angle = props.angle || 0;
        this.radius = props.radius || 0;
    }

    getChildren(): PlantPart<any>[] {
        return this.next.slice();
    }
    
    tick(plant: Plant): void {
        const gene = plant.gene;
        const totalLimit = gene[1];
        const leafLimitFactor = gene[4];

        const totalPosition = Math.abs(this.pos.y) + this.radius;
        const partLimit = constraints(-(totalPosition / 500) + 1, 0, 1) * leafLimitFactor;

        let [growLength, nextPartType, nextBranchAngle] = plant.growStrategy.grow([
            plant.age, 
            this.type.num, 
            this.pos.y, 
            0, 
            0, 
            0,
        ]);

        // if (this.length < partLimit) {
        //     growLength = (1 / (50 * (this.length / partLimit + 1)) + 0.01) * (partLimit - this.length);
        //     if (totalPosition / 500 < 0.12) {
        //         nextPartType = nextPartType * 0.5 + 0.2;
        //     }
        // }

        this.radius += growLength * plant.consumeNutrition(growLength, this);
    }

    applyGene(plant: Plant, [growLength, nextPartType, nextBranchAngle]): void {
        this.radius += growLength * plant.consumeNutrition(growLength, this);
    }

    update(): void {
        
    }
    
    render(g: CanvasRenderingContext2D): void {
        g.fillStyle = "#000000";
        g.beginPath();
        g.arc(this.pos.x, this.pos.y, this.radius, 0, TWO_PI);
        g.fill();
    }
}