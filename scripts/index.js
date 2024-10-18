const terminal = require('terminal-kit').terminal;
const { getInitialBlock } = require('./helpers');
const { getChoice } = require("./helpers/term")
const generateNewBlock = require("./helpers/generateNewBlock")
const { Map } = require("./utils/index");
const { Graph } = require('graphlib'); // Use a graph library
const placeObjects = require('./helpers/placeObjects');
const {generateTiles, placeTiles} = require('./helpers/generateTiles');
const generateFloor = require('./helpers/generateFloor');

const initializeMap = () => {
    const map = new Map({
        width: 60,
        height: 30,
        background: "#132b27",
        mobileBackground: "#132b27",
        pixelBackground: "#0a1614",
        tint: "0.025, -0.025, -0.0125, 0",
        floorHeight: 3,
    });
    return map
}
const initializeGraph = () => new Graph({ directed: true });

const reconstructMap = (map, blocks) => {
    map.clear(); // Clear the existing map
    blocks.forEach(block => {
        block.addToMap()
        if (block.tilesGrid) placeTiles(map, block, block.tilesGrid)
    });
};


const interactiveGenerateLevel = async () => {
    let graph = initializeGraph();
    let map = initializeMap(graph);
    const floor = generateFloor(map)
    // map.addBlock({ block: floor, layer: "fg" })
    let blocks = [floor];
    
    const initialBlock = getInitialBlock(floor, graph)
    blocks.push(initialBlock)

    reconstructMap(map, blocks)

    await map.exportMap("testlevel")

    let iter = 1;

    while (true) {
        const lastBlock = graph.node(iter - 1);
        let newBlock = generateNewBlock(lastBlock, map);
        if (newBlock.x < 0 || newBlock.y + newBlock.h > map.h - (map.floorHeight ?? 4)) {
            // out of bounds or partly occluded by floor so retry
            continue;
        }
        
        reconstructMap(map, [...blocks, newBlock])

        await map.exportMap("testlevel")

        const choices = ["Retry", "Proceed", "Proceed & Terminate", "Discard & Terminate"]
        const response = await getChoice(choices, "Like this block?");
        const proceedAndTerminate = response === choices[2]
        const discardAndTerminate = response === choices[3]
        const terminate = proceedAndTerminate || discardAndTerminate
        const userAccepted = response === choices[1] || proceedAndTerminate

        if (userAccepted) {
            while (true) {
                const tilesGrid = generateTiles(newBlock)
                const undoTiles = placeTiles(map, newBlock, tilesGrid)
                await map.exportMap()
                const accepted = (await getChoice(["Randomize", "Proceed"], "Like this pattern?")) === "Proceed"
                if (accepted) {
                    newBlock.tilesGrid = tilesGrid
                    break
                }
                undoTiles()
            }

            graph.setNode(iter, newBlock);
            graph.setEdge(iter - 1, iter);
            blocks.push(newBlock);

            iter++;
            if (terminate) break
        } else {
            terminal.red("Retrying current iteration...\n");
            reconstructMap(map, blocks)
            if (terminate) break
        }
    }
    
    for (const block of blocks) {
        map.centerCamera(block)
        await placeObjects(block, map)
    }
    terminal("\nFinal Level:\n");
    terminal("\nLevel design complete. Press any key to exit.\n");
    terminal.grabInput(true);
    terminal.on('key', () => process.exit());
};

terminal.on('key', (name) => {
    if (name === 'CTRL_C' || name === 'ESCAPE') {
        console.log('\nExiting application...');
        terminal.grabInput(false); // Disable input grabbing
        process.exit(); // Terminate the app
    }
})

interactiveGenerateLevel();
