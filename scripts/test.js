const { detectProjectedEmptySpaces } = require("./utils/detectProjectedEmptySpaces");
const { CompositeBlock, Map, Block } = require("./utils/index");
const { Graph } = require('graphlib'); // Use a graph library

const rand = (to, from = 0) => from + Math.floor((to - from + 1) * Math.random())
const skewedRand = (to, from = 0) => from + Math.floor((to - from + 1) * Math.random() * Math.random())
const pickOne = arr => arr[rand(arr.length - 1)]
const map = new Map({
    width: 60,
    height: 20,
    background: "#132b27",
    mobileBackground: "#132b27",
    pixelBackground: "#0a1614",
    tint: { r: 0.025, g: -0.025, b: -0.0125, a: 0 },
    floorHeight: 2
});


const graph = new Graph({ directed: true });

const leftWall = CompositeBlock.create({ width: 1, height: 8 })
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
    if (isLevelTraversable(graph)) {
        newBlock.addToMap();
        graph.setNode(iter, newBlock);
        graph.setEdge(iter - 1, iter);
        generateLevel(graph, iter + 1);
    } else {
        generateLevel(graph, iter);
    }
}

const addProtrusions = block => {

}
function generateNewBlock(prevBlock) {
    const newBlock = CompositeBlock.create({
        width: skewedRand(1, 5) + 2, // Width between 2 and 6
        height: skewedRand(1, 3) + 2 // Height between 2 and 4
    })
    addProtrusions(newBlock)
    const expandDir = skewedRand(6) < 2 ? "horizontal" : "vertical"
    if (expandDir === "horizontal") {
        const params = { position: pickOne(["right", "right-start", "right-end"]), dx: skewedRand(6, 3) }
        newBlock.stackOn(prevBlock, params)
    } else {
        const params = { position: pickOne(["right", "right-end", "right-start", "top", "top-start", "top-end"]), dy: -skewedRand(4, 2), dx: rand(1) }
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