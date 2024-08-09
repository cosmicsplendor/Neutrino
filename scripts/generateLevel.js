const fs = require("fs/promises")

const atlasPath = "./src/assets/images/atlasmeta.cson"
const W = 48
const H = 48
const GRID_WIDTH = 46
const GRID_HEIGHT = 30
const floorHeight = 5

const  generateEmptyLevel = () => {
    const grid = Array(GRID_HEIGHT * GRID_WIDTH).fill(null)
    const collisionRects = [
        { x: 0, y: H * (GRID_HEIGHT - floorHeight), width: W * GRID_WIDTH, height: H * floorHeight }
    ]
    const spawnPoints = [
        { name: "player", x: 55, y: 0 }
    ]
    const width = collisionRects[0].width
    const height = collisionRects[0].y + collisionRects[0].height
    const bg = "#132b27"
    const mob_bg = "#132b27"
    const pxbg = "#0a1614"
    const tint = "0.025, -0.025, -0.0125, 0"
    const checkpoints = [
        { x: W * 10, y: H * 35 }
    ]
    const fgTiles = []
    const mgTiles = []
    const tiles = []

    // generate floors
    for (let i = GRID_HEIGHT - 1; i >= GRID_HEIGHT - floorHeight; i--) {
        for (let j = 0; j < GRID_WIDTH; j++) {
            grid[i * GRID_WIDTH + j] = "wt_1"
        }
    }

    grid.forEach((tile, i) => {
        if (!tile) return
        const x = (i % GRID_WIDTH) * W
        const y = Math.floor(i / GRID_WIDTH) * H
        tiles.push({ name: tile, x, y })
    })

    return { collisionRects, spawnPoints, width, height, bg, mob_bg, pxbg, tint, checkpoints, fgTiles, mgTiles, tiles }
}

const getAtlas = async () => {
    const buffer = await fs.readFile(atlasPath)
    const data = JSON.parse(buffer.toString("utf-8"))
    const entries = Object.entries(data)
    entries.forEach(e => {
        if (e[1].rotation) {
            const { width, height } = e[1]
            e[1].width = height
            e[1].height = width
        }
    })
    return Object.fromEntries(entries)
}


const level = generateEmptyLevel()


const exportLevel = async (num) => {
    const path = `src/assets/levels/new-level-${num}.cson`
    await fs.writeFile(path, JSON.stringify(level))
}

exportLevel(11, level)