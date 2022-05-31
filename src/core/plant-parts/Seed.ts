import Vec2 from "vec2";
import { HALF_PI, TWO_PI } from "../../utils/math";
import type { Plant } from "../plants/Plant";
import { Branch } from "./Branch";
import { PlantPart, PlantPartType } from "./PlantPart";

export interface SeedProps {
    pos?: Vec2;
    next?: Branch;
}

export class Seed implements PlantPart<Seed> {
    public static readonly TYPE: PlantPartType<Seed> = new PlantPartType(() => new Seed({}), 0);

    prev: PlantPart<any> | null = null;
    type = Seed.TYPE;
    pos: Vec2;
    next: Branch | null;

    constructor(props: SeedProps) {
        this.pos = props.pos || new Vec2(0, 0);
        this.next = props.next || null;
    }

    getChildren(): PlantPart<any>[] {
        return this.next ? [this.next] : [];
    }

    tick(plant: Plant): void {

        if (!this.next) {
            let [growLength, nextPartType, nextBranchAngle] = plant.growStrategy.grow([
                plant.age,
                this.type.num, 
                this.pos.y,
                this.next ? 1 : 0,
                0,
            ]);

            this.next = new Branch({
                prev: this,
                angle: -HALF_PI + nextBranchAngle,
                length: 1,
                width: 1,
            });
        }
    }

    update(): void {
        if (this.next) {
            this.next.pos.set(this.pos.x, this.pos.y, false);
        }
    }

    render(g: CanvasRenderingContext2D): void {
        g.fillStyle = "#000000";
        g.beginPath();
        g.arc(this.pos.x, this.pos.y, 2, 0, TWO_PI);
        g.fill();
    }
}