// interactiveLevelDesigner.js

const terminal = require('terminal-kit').terminal;
const { detectProjectedEmptySpaces } = require("./utils/detectProjectedEmptySpaces");
const { CompositeBlock, Map, Block } = require("./utils/index");
const { Graph } = require('graphlib'); // Use a graph library

// Utility Functions
const rand = (to, from = 0) => from + Math.floor((to - from + 1) * Math.random());
const skewedRand = (to, from = 0) => from + Math.floor((to - from + 1) * Math.random() * Math.random());
const pickOne = arr => arr[rand(arr.length - 1)];

// Initialize Map
const initializeMap = () => new Map({
    width: 60,
    height: 30,
    background: "#132b27",
    mobileBackground: "#132b27",
    pixelBackground: "#0a1614",
    tint: "0.025, -0.025, -0.0125, 0",
    floorHeight: 2,
});

// Initialize Graph
const initializeGraph = () => new Graph({ directed: true });

// Add Initial Block
const addInitialBlock = (map, graph) => {
    const leftWall = CompositeBlock.create({ width:2, height: 8 })
        .addPart({ width: 2, height: 3, position: "right-end", onto: "last" })
        .stackOn(map.floor, { position: "top-start" })
        .addToMap();

    graph.setNode(0, leftWall);
    return leftWall;
};

// Add Protrusions to a Block
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

// Pick Vertical Alignment Parameters
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

// Fix Horizontal Gap
const fixHorizontalGap = (block, emptySpaces) => {
    const { left, right } = emptySpaces;
    if (right.w === 1) {
        return block.shift(1);
    }
    if (left.w === 1) {
        return block.shift(-1);
    }
};

// Fix Vertical Gap
const fixVerticalGap = (block, emptySpaces) => {
    const { top, bottom } = emptySpaces;
    if (bottom.h === 1) {
        return block.shift(0, 1);
    }
    if (top.h === 1) {
        return block.shift(0, -1);
    }
};

// Generate a New Block
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
            dx: skewedRand(8, 3), 
            dy: 2 * skewedRand(2, 1) + rand(2, 1) 
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

// Reconstruct Map from Blocks
const reconstructMap = (map, blocks) => {
    map.clear(); // Clear the existing map
    blocks.forEach(block => block.addToMap());
};

// Prompt User for Input
const promptUser = (message) => {
    return new Promise((resolve) => {
        terminal.singleColumnMenu(['Yes', 'No'], (error, response) => {
            if (error) {
                terminal.red(`Error: ${error}\n`);
                process.exit(1);
            }
            if (response.selectedIndex === 0) resolve(true); // Yes
            else resolve(false); // No
        });
    });
};

// Implementing map.clear()
// Assuming the Map class does not have a clear method, we'll add it here.
// Modify this if the Map class already has a clear method.

// Map.prototype.clear = function() {
//     this.blocks = []; // Reset the blocks array
//     // If there are other properties to reset, do so here
// };

// Main Interactive Level Generation Function
const interactiveGenerateLevel = async () => {
    let map = initializeMap();
    let graph = initializeGraph();
    let blocks = [];

    // Add Initial Block
    const initialBlock = addInitialBlock(map, graph);
    blocks.push(initialBlock);
    let iter = 1;

    while (true) {
        const lastBlock = graph.node(iter - 1);
        let newBlock = generateNewBlock(lastBlock, map);

        // Check for out of bounds
        if (newBlock.x + newBlock.w > map.width) {
            terminal.green("\nLevel generation complete.\n");
            break;
        }

        // Temporarily add the new block
        // Note: Do not modify the original blocks array yet
        const tempBlocks = [...blocks, newBlock];
        const tempMap = initializeMap();
        tempMap.clear(); // Clear the temp map
        tempBlocks.forEach(block => block.addToMap());
        tempMap.printAsciiScaled();

        // Prompt user
        terminal("\nDo you like this block? (Yes/No)\n");
        const userAccepted = await promptUser("Accept block?");

        if (userAccepted) {
            graph.setNode(iter, newBlock);
            graph.setEdge(iter - 1, iter);
            blocks.push(newBlock);
            iter++;
            // Update the main map
            reconstructMap(map, blocks);
        } else {
            terminal.red("Retrying current iteration...\n");
            // No need to modify the blocks array
            // The loop will generate a new block in the next iteration
        }
    }

    // Final Map Display
    terminal("\nFinal Level:\n");
    map.printAsciiScaled();
    terminal("\nLevel design complete. Press any key to exit.\n");
    terminal.grabInput(true);
    terminal.on('key', () => process.exit());
};

// Execute the Interactive Level Designer
interactiveGenerateLevel();
