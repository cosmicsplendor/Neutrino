const clamp = (min, max, value) => Math.max(min, Math.min(max, value));

function weightedRand(from, to, density) {
    if (density === 0) return from;

    const weight = density / 100;
    const random = Array(5).fill(0).map(() => Math.random()).reduce((acc, x) => x + acc, 0) / 5; // Adds more variability
    const mean = from + (to - from) * weight;
    const value = Math.round(mean * random * 2);

    return clamp(Math.min(from, to), Math.max(from, to), value);
}


console.log(weightedRand(100, 0, 25))