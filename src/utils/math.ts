import Vec2 from "vec2";

export type int = number;
export type float = number;

export function randInt(min: number, max: number): int {
    return Math.floor(Math.random() * (max - min) + min);
}

export function randIntRound(min: number, max: number): int {
    return Math.round(Math.random() * (max - min) + min);
}

export function rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function constraints(origin: number, min: number, max: number) {
    if (max <= min) return min;
    return Math.min(Math.max(min, origin), max);
}

export function calcSamplePoints(curve: Curve, sampleCount: int, sampleStart: number, sampleEnd: number, polarToCartesian: boolean = false): Vec2[] {
    const result: Vec2[] = Array(sampleCount);
    const step = (sampleEnd - sampleStart) / sampleCount;
    for (let i = 0; i < sampleCount; i++) {
        const x = sampleStart + i * step;
        const y = curve(x);
        const point = polarToCartesian ? new Vec2(y * Math.cos(x),y * Math.sin(x)) : new Vec2(x, y);
        result[i] = point;
    }
    return result;
}

export function vec2FromAngle(angle: float, length: float): Vec2 {
    return new Vec2(length * Math.cos(angle), length * Math.sin(angle));
}

export function angleOfVec2(v: Vec2): float {
    return Math.atan2(v.y, v.x);
}

export function makePolarFourierCurve(nums: number[], period: number): Curve {
    const o = TWO_PI / period;
    const a0 = nums[0];
    const items: Curve[] = [() => a0 / 2];

    for (let i = 1; i < nums.length; i++) {
        const a = nums[i];
        const b = nums[i + 1] || 0;
        items.push((x) => a * Math.cos(i * o * x) + b * Math.sin(i * o * x));
    }


    return (x: number) => items.reduce((p, it) => p + it(x), 0);
}

export const TWO_PI = 2 * Math.PI;
export const HALF_PI = Math.PI / 2;
export type Curve = (x: number) => number;
export const FN_0: Curve = () => 0;
export const FN_LINEAR: Curve = x => x;