const { placeTiles } = require("./generateTiles")
const { calcAligned } = require("../utils")

const generateFloor = (map) => {
    const floor = calcAligned(map, new Block(map.w, map.floorHeight ?? 4), "left", "bottom")
    const tilesGrid = Array.from({ length: floor.h }, (_, row) => {
        return Array.from({ length: floor.w }, (_, col) => {
            return row === 0 ? "wt_9": "wt_1"
        })
    })
    floor.tilesGrid = tilesGrid
    placeTiles(map, block, tilesGrid)
    return floor
}

module.exports = generateFloor