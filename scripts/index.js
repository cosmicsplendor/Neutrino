const terminal = require('terminal-kit').terminal;
const { addProtrusions, getInitialBlock } = require('./helpers');
const { detectProjectedEmptySpaces } = require("./utils/detectProjectedEmptySpaces");
const { CompositeBlock, Map, rand, skewedRand, pickOne } = require("./utils/index");
const { Graph } = require('graphlib'); // Use a graph library
const projectCompositeRects = require('./utils/projectCompositeRects');

const initializeMap = () => {
    const map = new Map({
        width: 60,
        height: 30,
        background: "#132b27",
        mobileBackground: "#132b27",
        pixelBackground: "#0a1614",
        tint: "0.025, -0.025, -0.0125, 0",
        floorHeight: 2,
    });
    return map
}
const initializeGraph = () => new Graph({ directed: true });


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

const reconstructMap = (map, blocks) => {
    map.clear(); // Clear the existing map
    blocks.forEach(block => block.addToMap());
};

const promptAccept = () => {
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

const promptFields = async () => {
    const name = await terminal.inputField({ 
        echo: true, 
        prompt: 'name: ' 
    }).promise;

    const alignment = await terminal.inputField({
        echo: true, 
        prompt: 'alignment (left|center|right)-(top|center|bottom): ' 
    }).promise;

    return { name, alignment };
};

const handleAddMore = async () => {
    const addAnother = await terminal.singleColumnMenu(['Yes', 'No'], {
        title: 'Would you like to add another object?'
    }).promise;

    if (addAnother.selectedText === 'Yes') {
        return true;
    }

    return false;
};

const placeObject = async projection => {




    while (true) {
        while (true) {
            const { name, alignment } = await promptFields();
            // Store the object details as required
            const proceed = (await terminal.singleColumnMenu(['Proceed', 'Retry']).promise).selectedText === "Proceed"
            if (proceed) break
            // undo the current action and continue with the retry
        }
        const addMore = await handleAddMore();
        if (!addMore) {
            break; 
        }
    }
};

const placeObjects = async (newBlock, map) => {
    const projections = projectCompositeRects(newBlock, map.collisionRects, map)
    for (const projection of projections) {
        map.projections.push(projection);
        await map.exportMap();
        await placeObject()
        // map.projections.length = 0
    }
    map.projections.length = 0
}

const interactiveGenerateLevel = async () => {
    let graph = initializeGraph();
    let map = initializeMap(graph);
    const initialBlock = getInitialBlock(map, graph)
    let blocks = [initialBlock];

    let iter = 1;

    while (true) {
        const lastBlock = graph.node(iter - 1);
        let newBlock = generateNewBlock(lastBlock, map);

        
        if (newBlock.x + newBlock.w > map.width) {
            terminal.green("\nLevel generation complete.\n");
            break;
        }
        
        reconstructMap(map, [...blocks, newBlock])
        map.printAscii();

        await map.exportMap("testlevel")

        terminal("\nDo you like this block? (Yes/No)\n");
        const userAccepted = await promptAccept("Accept block?");

        if (userAccepted) {
            graph.setNode(iter, newBlock);
            graph.setEdge(iter - 1, iter);
            blocks.push(newBlock);
            await placeObjects(newBlock, map)
            iter++;
        } else {
            terminal.red("Retrying current iteration...\n");
            reconstructMap(map, blocks)
        }
    }

    terminal("\nFinal Level:\n");
    map.printAscii();
    terminal("\nLevel design complete. Press any key to exit.\n");
    terminal.grabInput(true);
    terminal.on('key', () => process.exit());
};

interactiveGenerateLevel();
