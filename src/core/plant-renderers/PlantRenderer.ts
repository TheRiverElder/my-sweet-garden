import type { Plant } from "../plants/Plant";

export interface PlantRenderer {
    render(canvas: HTMLCanvasElement, plant: Plant): void;
}