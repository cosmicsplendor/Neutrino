const scoreArea = a => {
    if (a <= 6) {
        return 1;
    } else {
        return Math.min(6 * Math.pow(a, -0.9), 1);  // Adjust the exponent for slower decay
    }
}

const logScores = () => {
    for (let a = 6; a <= 50; a++) {
        console.log(`a = ${a}, score = ${scoreArea(a)}`);
    }
}

logScores();
