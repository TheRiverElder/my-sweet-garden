import type { PlantRenderer } from "./PlantRenderer";
import type { PlantPart } from "../plant-parts/PlantPart";
import type { Plant } from "../plants/Plant";
import Vec2 from "vec2";
import { END_CHILD_TYPES } from "../plant-parts/Branch";
import { TWO_PI } from "../../utils/math";

export class Canvas2DRenderer implements PlantRenderer {

    render(canvas: HTMLCanvasElement, plant: Plant): void {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const g = canvas.getContext('2d');
        const offset = new Vec2(canvas.width / 2, canvas.height / 2);
        g.translate(offset.x, offset.y);
        g.transform(2, 0, 0, 2, 0, 0);

        const queue: PlantPart<any>[] = [plant.body];
        const endParts: PlantPart<any>[] = [];
        while (queue.length || endParts.length) {
            while (queue.length) {
                const part = queue.shift();
                for (const child of part.getChildren()) {
                    (END_CHILD_TYPES.includes(child.type) ? endParts : queue).push(child);
                }
                part.render(g);
            }
            while (endParts.length) {
                const part = endParts.shift();
                for (const child of part.getChildren()) {
                    (END_CHILD_TYPES.includes(child.type) ? endParts : queue).push(child);
                }
                part.render(g);
            }
        }

        // g.translate(-offset.x, -offset.y);
        // g.setTransform(g.getTransform().invertSelf());
    }
}