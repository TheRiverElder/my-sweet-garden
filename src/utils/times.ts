const TIME_UNITS: [number, string][] = [
    [1000 * 60 * 60 * 24 * 365, "年"],
    [1000 * 60 * 60 * 24, "天"],
    [1000 * 60 * 60, "小时"],
    [1000 * 60, "分"],
    [1000, "秒"],
];

export function toLocaleAgeString(time: number) {
    let t = time;
    const builder = [];
    for (const [period, localeUnit] of TIME_UNITS) {
        const num = Math.floor(t / period);
        if (num <= 0) continue;
        builder.push(num, localeUnit)
        t %= period;
    }

    if (builder.length === 0) {
        builder.push(0, TIME_UNITS[TIME_UNITS.length - 1][1]);
    }

    return builder.join('');
}