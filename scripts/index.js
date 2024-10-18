const terminal = require('terminal-kit').terminal;
const { getInitialBlock } = require('./helpers');
const { getChoice } = require("./helpers/term")
const generateNewBlock = require("./helpers/generateNewBlock")
const { Map } = require("./utils/index");
const { Graph } = require('graphlib'); // Use a graph library
const placeObjects = require('./helpers/placeObjects');
const { generateTiles, placeTiles } = require('./helpers/generateTiles');
const generateFloor = require('./helpers/generateFloor');
const getTileNumber = require('./helpers/generateTiles/helpers/createGrid/getTileNumber');

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

const scan = async (map, block) => {
    const topEmptiers = ["win2"]
    const leftEmptiers = ["wt_14", "wt_17", "wt_15", "wt_16"]
    const getAdjacentTile = (row, col, dir = { x: 0, y: 0 }) => {
        return map.getTile(col + dir.x, row + dir.y)
    }
    const boundingBlock = Array.from({ length: block.h + 4 }, (_, row) => {
        return Array.from({ length: block.w + 4 }, (_, col) => {
            const x = block.x - 2 + col
            const y = block.y - 2 + row
            if (x < 0 || x > map.w - 1 || y < 0 || y > map.h - 1) return 1
            const leftTile = getAdjacentTile(y, x, { x: -1, y: 0 })
            const rightTile = getAdjacentTile(y, x, { x: 1, y: 0 })
            const topTile = getAdjacentTile(y, x, { x: 0, y: 1 })
            const tile = map.getTile(x, y)
            if (!tile) {
                if (leftEmptiers.includes(leftTile)) return 1
                if (topEmptiers.includes(topTile)) return 1
                return 0
            }
            if (tile.startsWith("wt_")) {
                const num = Number(tile.slice(3))
                if (num === 14) return 2
                if (num === 15) return 3
                if (num === 16) return 4
                if (num === 17) return 5
                return num
            }
            return 1
        })
    })
    const normalizedGrid = boundingBlock.map(row => {
        return row.map(cell => !!cell ? 1 : 0)
    })
    normalizedGrid.forEach(row => console.log(row.join("")))

    const boundaryInfo = boundingBlock.map((row, j) => {
        return row.map((cell, i) => {
            console.log({ i, j })
            const tileNumber = getTileNumber(normalizedGrid, j, i)
            return { tileNumber, cell }
        }).slice(1, row.length - 1)
    }).slice(1, boundingBlock.length - 1)

    const validIs = [0, 1, block.w, block.w + 1]
    const validJs = [0, 1, block.h, block.h + 1]
    /**
     * got to deal with these following cases:
     * 1. right edge demolished - scan the grid and make sure tiles right to it is non existent
     * 2. all the engravings cells should be considered equivalent to wt_9
     * 3. left edge demolished - equvalent to left edge
     */
    const wt9Equiv = ["en11", "en12", "en13", "en14", "en15", "en16"]
    boundaryInfo.forEach((row, j) => {
        row.forEach(({ tileNumber, cell }, i) => {
            if (validIs.includes(i) || validJs.includes(j)) {
                if (cell === 0) return
                const tile = map.getTile(block.x+i-1, block.y+j-1)
                if (wt9Equiv.includes(tile) && tileNumber === 9) return
                if (tile === "wt_14") {
                    if (tileNumber === 2) return
                    if (tileNumber === 5) {
                        map.setTile(block.x - 1 + i, block.y - 1 + j, "wt_17")
                        return
                    }
                }
                if (tile === "wt_17") {
                    if (tileNumber === 5) return
                    map.setTile(block.x + i, block.y - 1 + j, "wt_1")
                }
                map.setTile(block.x - 1 + i, block.y - 1 + j, `wt_${tileNumber}`)
            }
        })
    })
    await map.exportMap("testlevel")
    process.exit(0)
}

const interactiveGenerateLevel = async () => {
    let graph = initializeGraph();
    let map = initializeMap(graph);
    const floor = generateFloor(map)
    // map.addBlock({ block: floor, layer: "fg" })
    let blocks = [floor];

    const initialBlock = getInitialBlock(floor, graph)
    blocks.push(initialBlock)
    reconstructMap(map, blocks)

    await decorateBlock(map, initialBlock)
    /**
     * take the map, scan every block within +-1 for edge tiles that are out of alignment
     */
    await scan(map, initialBlock)
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
            await decorateBlock()
            await map.exportMap("testlevel")

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
