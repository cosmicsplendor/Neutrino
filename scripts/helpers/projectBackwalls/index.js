const { scoreArea, scoreSupportingWidth, scoreWidth } = require("./scoreFns");
const projectCompositeRects = require("../../utils/projectCompositeRects");

const getMapTiles = (map, x, y) => {
    if (x < 0 || x >= map.w) return false
    if (y < 0 || y >= map.h) return true
    map.getTile(x, y) ? 1: 0
}

const getSupportingWidth = (map, p) => {
    if (p.normal === "left") {
        return Array(p.h).fill(p.y).map((py, i) => getMapTiles(map, p.x - 1, py + i))
    }
    if (p.normal === "right") {
        return Array(p.h).fill(p.y).map((py, i) => getMapTiles(map, p.x + p.w, py + i))
    }
    if (p.normal === "top") {
        return Array(p.w).fill(p.x).map((px, i) => getMapTiles(map, px + i, p.y - 1))
    }
    if (p.normal === "bottom") {
        return Array(p.w).fill(p.x).map((px, i) => {
            const sw = getMapTiles(map, px + i, p.y + p.h)
            return sw
        })
    }
    return []
}

const computeScore = (map, p) => {
    const area =  p.w * p.h
    const width = p.normal == "left" || p.normal === "right" ? p.h: p.w
    const height = p.normal == "left" || p.normal === "right" ? p.w: p.h
    const supportingWidth = getSupportingWidth(map, p).filter(b => b).length
    const areaScore = scoreArea(area)
    const widthScore = scoreWidth(width)
    const supportingWidthScore = scoreSupportingWidth(width, supportingWidth, height)
    // return Math.sqrt(area * area + width * width + supportingWidth * supportingWidth)
    return (areaScore + widthScore + supportingWidthScore) / 3
}

const findBestProjections = (map, projectionsByNormal) => {
    const best = Object.values(projectionsByNormal)
        .map(projections => {
            const score = computeScore(map, projections)
            return { score, projections }
        })
        .sort((p1, p2) => p2.score - p1.score)
    return best
}

const placeTiles = (map, projection) => {
    for (let x = 0; x < projection.w; x++) {
        for (let y = 0; y < projection.h; y++) {
            map.setTile(x, y, "bw1", "mg")
        }
    }
    // return Array(p.h).fill(p.y).map((py, i) => getMapTiles(map, p.x - 1, py + i))
}
const wait = sec => new Promise((r => setTimeout(r, sec * 1000)))
const generatePTiles = (map, p) => {
    // discard top and right projections
    if (p.normal === "top" || p.normal === "right") return []
    const supportingWidth = getSupportingWidth(map, p)
}

const generateTiles= (map, projections) => {
    const allTiles = []
    for (const p of projections) {
        const tiles = generatePTiles(map, p)
        tiles.forEach(tile => allTiles.push(tile))
        if (allTiles.length > 24) return
    }
    return allTiles
}

const projectBackwalls = async (map, block) => {
    const projections = projectCompositeRects(block, map.collisionRects, map)
    const bestProjections = findBestProjections(map, projections)
    console.log(bestProjections)
    placeTiles(map, bestProjections[0])
    await map.exportMap()
    await wait(300)
    // process.exit()
}

module.exports = projectBackwalls