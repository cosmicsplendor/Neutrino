const terminal = require('terminal-kit').terminal;
const { addProtrusions, getInitialBlock, fixHorizontalGap, fixVerticalGap } = require('./helpers');
const { getChoice, promptAccept, message, promptFields } = require("./helpers/term")
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

const placeObject = async (index, total) => {
    const indexInd = `[${index + 1} of ${total}] `

    const skipResponse = await getChoice(["Proceed", "Pass"], `Projection ${indexInd}`)
    if (skipResponse === "Pass") return

    message(indexInd + "Let's place some objects. .", "cyan");

    while (true) {
        while (true) {
            // prompt fields based on dynamic field generator for the perticular name
            const { name, alignment } = await promptFields();

            // pass the field values to the name's spawn point factory and get a new spawn point
            // store the spawn point temporarily, map.addTempSpawnPoint

            const nextMove = await getChoice(['Proceed', 'Retry', 'Discard']);
            if (nextMove === "Proceed") {
                // map.commitTempSpawnPoint
                message(`${name} successfully placed`, "blue")
                break
            }

            // undo the object details stored above
            // map.clearTempSpawnPoint
            if (nextMove === "Discard") break

            message("Let's try again. .", "green")
        }

        const addMore = await promptAccept("Add another object?");
        if (!addMore) break

        message(indexInd + "Let's place one more object. .");
    }
};


const placeObjects = async (newBlock, map) => {
    const projections = projectCompositeRects(newBlock, map.collisionRects, map)
    for (const index in projections) {
        const projection = projections[index]
        map.projections.push(projection);
        await map.exportMap();
        await placeObject(Number(index), projections.length)
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

        const userAccepted = await promptAccept("Do you like this block? (Yes/No)");

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

terminal.on('key', (name, matches, data) => {
    if (name === 'CTRL_C' || name === 'ESCAPE') {
        console.log('\nExiting application...');
        terminal.grabInput(false); // Disable input grabbing
        process.exit(); // Terminate the app
    }
})

interactiveGenerateLevel();
