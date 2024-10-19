const scoreArea = n => 1 / n
const scoreSupportingWidth = (width, supportingWidth) => supportingWidth / width
function scoreWidth(x) {
    if (x < 1) return 0
    const clampedX = Math.min(Math.max(x, 1), 9);
    
    let normalized = (clampedX) / 9;

    // Apply a non-linear transformation to the second half to speed up decay
    if (normalized > 0.5) {
        // Exaggerate the rate of decay for values greater than 0.5
        normalized = 0.5 + Math.pow((normalized - 0.5) * 2, 0.25) / 2;
    }

    // Create a bell-shaped curve using the modified normalized value
    const score = Math.sin(normalized * Math.PI);
    
    // Adjust the range to start from a small non-zero value
    const minScore = 0;
    return minScore + (1 - minScore) * score;
}

module.exports = {
    scoreArea,
    scoreSupportingWidth,
    scoreWidth
}