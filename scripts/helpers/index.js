const { CompositeBlock, rand, skewedRand, pickOne } = require("../utils");

const addProtrusions = (block) => {
    if (block.w > 2 && rand(10) > 5) {
        if (rand(10) > 3) {
            block.addPart({ width: 2, height: 2, position: pickOne(["bottom", "bottom-start", "bottom-end"]) });
        }
        if (rand(10) > 3) {
            block.addPart({
                width: skewedRand(block.w - 1, 2),
                height: skewedRand(3, 2),
                position: pickOne(["top", "top-start", "top-end"])
            });
        }
    }
    if (rand(10) > 8 && block.h > 2) {
        block.addPart({
            height: skewedRand(block.h - 1, 2),
            width: skewedRand(3, 2),
            position: pickOne(["left", "left-start", "left-end"])
        });
    }
};

const getInitialBlock = (floor, graph) => {
    const leftWall = CompositeBlock.create({ width: 2, height: 8 })
        .addPart({ width: 2, height: 3, position: "right-end", onto: "last" })
    leftWall.stackOn(floor, { position: "top-start" })
    graph.setNode(0, leftWall);
    return leftWall;
};
const fixHorizontalGap = (block, emptySpaces) => {
    const { left, right } = emptySpaces;
    if (right.w === 1) {
        return block.shift(1);
    }
    if (left.w === 1) {
        return block.shift(-1);
    }
};

const fixVerticalGap = (block, emptySpaces) => {
    const { top, bottom } = emptySpaces;
    if (bottom.h === 1) {
        return block.shift(0, 1);
    }
    if (top.h === 1) {
        return block.shift(0, -1);
    }
};
module.exports = {
    addProtrusions,
    getInitialBlock,
    fixHorizontalGap,
    fixVerticalGap
}