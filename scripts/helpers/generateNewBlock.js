const { addProtrusions, fixHorizontalGap, fixVerticalGap } = require('./index');
const { detectProjectedEmptySpaces } = require("../utils/detectProjectedEmptySpaces");
const { CompositeBlock, rand, skewedRand, pickOne } = require("../utils/index");

const pickVerticalAlignmentParams = (emptySpaces) => {
    const { bottom } = emptySpaces;
    if (bottom.h > 7) {
        return { position: "right-end", dy: 4 + rand(4), dx: 1 + rand(2, 1) };
    }
    return {
        position: pickOne(["right", "right-end", "right-start", "top", "top-start", "top-end"]),
        dy: -skewedRand(5, 2),
        dx: rand(2, 1) + skewedRand(2, 1)
    };
};



const generateNewBlock = (prevBlock, map) => {
    const newBlock = CompositeBlock.create({
        width: rand(3, 1) + skewedRand(5, 1) + 1, // Width between 2 and 6
        height: skewedRand(3, 1) + rand(3, 1) // Height between 2 and 4
    });

    addProtrusions(newBlock);

    const expandDir = prevBlock.y < 11 || skewedRand(20) < 4 ? "horizontal" : "vertical";
    if (expandDir === "horizontal") {
        const params = {
            position: pickOne(["right", "right-start", "right-end"]),
            dx: skewedRand(10, 3),
            dy: 2 * skewedRand(2, 1) + rand(rand(4, 1), 1)
        };
        newBlock.stackOn(prevBlock, params);
    } else {
        const emptySpaces = detectProjectedEmptySpaces(prevBlock, map);
        const params = pickVerticalAlignmentParams(emptySpaces);
        newBlock.stackOn(prevBlock, params);
    }

    const newEmptySpaces = detectProjectedEmptySpaces(newBlock, map);
    fixHorizontalGap(newBlock, newEmptySpaces);
    fixVerticalGap(newBlock, newEmptySpaces);

    return newBlock;
};

module.exports = generateNewBlock