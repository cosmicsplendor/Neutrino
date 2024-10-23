const terminal = require('terminal-kit').terminal;
const { getInitialBlock } = require('./helpers');
const { getChoice, promptAccept } = require("./helpers/term")
const generateNewBlock = require("./helpers/generateNewBlock")
const { Map } = require("./utils/index");
const { Graph } = require('graphlib'); // Use a graph library
const placeObjects = require('./helpers/placeObjects');
const { generateTiles, placeTiles } = require('./helpers/generateTiles');
const generateFloor = require('./helpers/generateFloor');
const fixBoundaries = require('./helpers/fixBoundaries');
const projectBackwalls = require('./helpers/projectBackwalls');

const initializeMap = () => {
    const map = new Map({
        width: 60,
        height: 30,
        // bg: "rgb(18 18 18)",
        // mob_bg: "rgb(18 18 18)",
        // pxBg: "#0a1614",
        "bg":"rgb(18 18 18)","mob_bg":"rgb(18 18 18)","pxbg":"0.090, 0.090, 0.090","tint":"0.025, 0.0125, -0.025, 0",
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
        if (block.backTiles) {
            block.backTiles.forEach(({ x, y, tile }) => {
                map.setTile(x, y, tile ?? "bw1", "mg")
            })
        }
    });
};

const decorateBlock = async (map, block) => {
    while (true) {
        const tilesGrid = generateTiles(block)
        const undoTiles = placeTiles(map, block, tilesGrid)
        await map.exportMap()
        const accepted = (await getChoice(["Randomize", "Proceed"], "Like this pattern?")) === "Proceed"
        if (accepted) {
            block.tilesGrid = tilesGrid
            break
        }
        undoTiles()
    }
}


const interactiveGenerateLevel = async () => {
    const loadSaved = await promptAccept("Do you want to load saved data?")

    let blocks, map 

    if (loadSaved) {
        const loaded = await Map.loadSaved()
        blocks = loaded.blocks
        map = loaded.blocks
    } else {
        let graph = initializeGraph();
        map = initializeMap(graph);
        const floor = generateFloor(map)
        blocks = [floor];
    
        const initialBlock = getInitialBlock(floor, graph)
        blocks.push(initialBlock)
        reconstructMap(map, blocks)
    
        await decorateBlock(map, initialBlock)
        /**
         * take the map, scan every block within +-1 for edge tiles that are out of alignment
         */
        await fixBoundaries(map, initialBlock)
        await map.exportMap("testlevel")
    }

    let iter = blocks.length - 1;

    while (true) {
        const lastBlock = graph.node(iter - 1);
        let newBlock = generateNewBlock(lastBlock, map);
        if (newBlock.x < 0 || newBlock.y + newBlock.h > map.h - (map.floorHeight ?? 4)) {
            // out of bounds or partly occluded by floor so retry
            continue;
        }

        reconstructMap(map, [...blocks, newBlock])
        map.addPreviewColRects(newBlock.collisionRects)
        await map.exportMap("testlevel")

        const choices = ["Retry", "Proceed", "Proceed & Terminate", "Discard & Terminate"]
        const response = await getChoice(choices, "Like this block?");
        const proceedAndTerminate = response === choices[2]
        const discardAndTerminate = response === choices[3]
        const terminate = proceedAndTerminate || discardAndTerminate
        const userAccepted = response === choices[1] || proceedAndTerminate

        if (userAccepted) {
            map.clearPreviewColRects()
            await decorateBlock(map, newBlock)
            await fixBoundaries(map, newBlock)
            newBlock.backTiles = await projectBackwalls(map, newBlock)
            await map.exportMap("testlevel")

            graph.setNode(iter, newBlock);
            graph.setEdge(iter - 1, iter);
            blocks.push(newBlock);
            iter++;
            await map.save()
            if (terminate) break
        } else {
            terminal.red("Retrying current iteration...\n");
            map.clearPreviewColRects()
            reconstructMap(map, blocks)
            if (terminate) break
        }
    }

    for (const block of blocks) {
        map.centerCamera(block)
        await placeObjects(block, map)
        await map.save()
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
