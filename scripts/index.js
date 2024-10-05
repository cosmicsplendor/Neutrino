const terminal = require('terminal-kit').terminal;
const { getInitialBlock } = require('./helpers');
const { getChoice, promptAccept, message, promptFields } = require("./helpers/term")
const generateNewBlock = require("./helpers/generateNewBlock")
const { Map } = require("./utils/index");
const { Graph } = require('graphlib'); // Use a graph library
const projectCompositeRects = require('./utils/projectCompositeRects');
const factories = require("./helpers/factories");
const { align, validAlignments } = require('./helpers/alignment');
const atlasCache = require('./helpers/atlasCache');
const applyOffsets = require('./helpers/applyOffsets');
const layerMap = require("./utils/layerMap.json")

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
    blocks.forEach(block => block.addToMap());
};

const queryAlignment = async () => {
    const { Alignment } = await promptFields(["Alignment"])
    const valid = validAlignments.includes(Alignment)
    if (!valid) {
        terminal.bold.red(`o oh, '${Alignment}' doesn't make sense. Let's try again. .\n`)
        return queryAlignment()
    }
    return Alignment
}

const placeObject = async (index, projections, map) => {
    const total = projections.length
    const indexInd = `[${index + 1} of ${total}] `

    const skipResponse = await getChoice(["Proceed", "Pass"], `Projection ${indexInd}`)
    if (skipResponse === "Pass") return

    const projection = projections[index]

    message(indexInd + "Let's place some objects. .", "cyan");

    while (true) {
        while (true) {
            const { Name: name } = await promptFields(["Name"]);
            const validName = await atlasCache.contains(name) || name === "checkpoint" || name === "player" || Object.keys(factories).contains(name)

            if (!validName) {
                message(`Invalid name '${name}'`, "red")
                terminal.bold.green("Let's try again. .\n")
                continue
            }
            const layer = layerMap[name]

            const alignment = await queryAlignment()
            const factory = name in factories ? factories[name]: factories.default
            const moreFields = factory.fields
            const props = (Array.isArray(moreFields)) ? await promptFields(moreFields): {}

            // compute coordinates based on alignment
            const coords = await align(name, projection, alignment)
            const offsetCoords = await applyOffsets(coords.x, coords.y, name, alignment)
            // pass the field values to the name's spawn point factory and get a new spawn point
            const spawnPoint = factory.create({ name, alignment, projection, ...offsetCoords, ...props })
            // post-processing: compute and add collision rects if necessary

            // store the spawn point temporarily, map.addTempSpawnPoint
            await map.addTempSpawnPoint(spawnPoint, layer)

            const nextMove = await getChoice(['Proceed', 'Retry', 'Discard']);
            if (nextMove === "Proceed") {
                await map.commitTempSpawnPoint()
                message(`${name} successfully placed`, "blue")
                break
            }

            // undo the last temp spawn point addition in case of retry/discard
            await map.clearTempSpawnPoint()
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
        await placeObject(Number(index), projections, map)
        map.projections.length = 0
    }
    map.projections.length = 0
}

const interactiveGenerateLevel = async () => {
    let graph = initializeGraph();
    let map = initializeMap(graph);
    const initialBlock = getInitialBlock(map, graph)
    let blocks = [initialBlock];

    reconstructMap(map, blocks)
    await map.exportMap("testlevel")
    await placeObjects(initialBlock, map)

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

terminal.on('key', (name) => {
    if (name === 'CTRL_C' || name === 'ESCAPE') {
        console.log('\nExiting application...');
        terminal.grabInput(false); // Disable input grabbing
        process.exit(); // Terminate the app
    }
})

interactiveGenerateLevel();
