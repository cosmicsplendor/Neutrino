const projectCompositeRects = require("../utils/projectCompositeRects");
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

const getInitialBlock = (map, graph) => {
    const leftWall = CompositeBlock.create({ width: 2, height: 8 })
        .addPart({ width: 2, height: 3, position: "right-end", onto: "last" })
    leftWall.stackOn(map.floor, { position: "top-start" })
    const projections = projectCompositeRects(leftWall, map.collisionRects, map)
    console.log(projections)
    graph.setNode(0, leftWall);
    return leftWall;
};

module.exports = {
    addProtrusions,
    getInitialBlock
}