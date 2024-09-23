const { detectProjectedEmptySpaces } = require("./utils/detectProjectedEmptySpaces");
const { CompositeBlock, Map, Block } = require("./utils/index");
const { Graph } = require('graphlib'); // Use a graph library

const rand = (to, from = 0) => from + Math.floor((to - from + 1) * Math.random())
const skewedRand = (to, from = 0) => from + Math.floor((to - from + 1) * Math.random() * Math.random())
const pickOne = arr => arr[rand(arr.length - 1)]
const map = new Map({
    width: 60,
    height: 30,
    background: "#132b27",
    mobileBackground: "#132b27",
    pixelBackground: "#0a1614",
    tint: "0.025, -0.025, -0.0125, 0",
    floorHeight: 2,
});


const graph = new Graph({ directed: true });

const leftWall = CompositeBlock.create({ width:2, height: 8 })
    .addPart({ width: 2, height: 3, position: "right-end", onto: "last" })
    .stackOn(map.floor, { position: "top-start" })
    .addToMap();

graph.setNode(0, leftWall);

function generateLevel(graph, iter = 1) {
    const lastBlock = graph.node(iter - 1)
    const newBlock = generateNewBlock(lastBlock);
    if (newBlock.x + newBlock.w > map.w) {
        return; // End recursion if out of bounds
    }
    newBlock.addToMap();
    graph.setNode(iter, newBlock);
    graph.setEdge(iter - 1, iter);
    generateLevel(graph, iter + 1);
    // if (isLevelTraversable(graph) && newBlock.y > 0) {
    // } else {
    //     generateLevel(graph, iter);
    // }
}

const addProtrusions = (block) => {
    if (block.w > 2 && rand(10) > 5) {
        rand(10) > 3 && block.addPart({ width: 2, height: 2, position: pickOne(["bottom", "bottom-start", "bottom-end"])})
        rand(10) > 3 && block.addPart({ width: skewedRand(block.w - 1, 2), height: skewedRand(3, 2), position: pickOne(["top", "top-start", "top-end"])})
    }
    if (rand(10) > 8 && block.h > 2) {
        block.addPart({ height: skewedRand(block.h - 1, 2), width: skewedRand(3, 2), position: pickOne(["left", "left-start", "left-end"])})
    }
}
const pickVerticalAlignmentParams = ({ bottom }) => {
    if (bottom.h > 7) {
        return { position: "right-end", dy: 4 + rand(4), dx: 1 + rand(2, 1)}
    }

    return { position: pickOne(["right", "right-end", "right-start", "top", "top-start", "top-end"]), dy: -skewedRand(5, 2), dx: rand(2, 1) + skewedRand(2, 1) }
}
function generateNewBlock(prevBlock) {
    const newBlock = CompositeBlock.create({
        width: rand(3, 1) + skewedRand(5, 1) + 1, // Width between 2 and 6
        height: skewedRand(3, 1) + rand(3, 1) // Height between 2 and 4
    })
    const emptySpaces = detectProjectedEmptySpaces(prevBlock, map)
    const expandDir = prevBlock.y < 11 || skewedRand(20) < 4 ? "horizontal" : "vertical"
    addProtrusions(newBlock)
    if (expandDir === "horizontal") {
        const params = { position: pickOne(["right", "right-start", "right-end"]), dx: skewedRand(8, 3), dy: 2 * skewedRand(2, 1) + rand(2, 1)}

        newBlock.stackOn(prevBlock, params)
    } else {
        const params = pickVerticalAlignmentParams(emptySpaces)
        newBlock.stackOn(prevBlock, params)
    }

    return newBlock;
}
generateNewBlock.yDir = 1

function isLevelTraversable(graph) {
    return true
}
// console.log(detectProjectedEmptySpaces(leftWall, map))
generateLevel(graph);
map.printAsciiScaled();
map.exportMap("testlevel")