export type Size = number | string;

export function convertSize(size: Size): string {
    if (typeof size === 'number') return size + 'px';
    else if (typeof size === 'string') return size;
    else return size as string;
}