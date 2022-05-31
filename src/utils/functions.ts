
const BUILTIN_MATH_FUNCTIONS: [string, Function][] = [
    ['sin', Math.sin],
    ['cos', Math.cos],
    ['tan', Math.tan],
    ['max', Math.max],
    ['min', Math.min],
];

export function makeCurve(txt: string) {
    const fn = new Function(...BUILTIN_MATH_FUNCTIONS.map(it => it[0]), 'r', 'return ' + txt);
    return (...args: any) => fn(...BUILTIN_MATH_FUNCTIONS.map(it => it[1]), ...args);
}