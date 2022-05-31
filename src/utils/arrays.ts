export function createArray<T>(length: number, gen: (index: number) => T): T[] {
    return Array(length).fill(0).map((_, index) => gen(index));
}

export function numberSum(array: number[]): number {
    return array.reduce((p, v) => p + v, 0);
}

export function numberSort(array: number[]): number[] {
    return array.sort((a, b) => a - b);
}