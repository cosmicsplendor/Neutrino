function weightedRand(from, to, density) {
    if (density === 0) return from;
    const weight = density / 100;
    const random = Array(5).fill(0).map(() => Math.random()).reduce((acc, x) => x + acc, 0) / 5; // Adds more variability
    const value = from + (to - from) * weight;
    return Math.round(value * random * 2);
}

console.log(weightedRand(0, 100, 25))