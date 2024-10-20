const { scoreArea, scoreSupportingWidth, scoreWidth } = require("./scoreFns");
const projectCompositeRects = require("../../utils/projectCompositeRects");
const { skewedRand, rand } = require("../../utils");

const MAX_TILES = 24

const getMapTiles = (map, x, y) => {
    if (x < 0 || x >= map.w) return 0
    if (y < 0 || y >= map.h) return 0
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
    const supportingWidth = getSupportingWidth(map, p).filter(b => b !== 0).length
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


const wait = sec => new Promise((r => setTimeout(r, sec * 1000)))

const generateLeftTiles = (map, p) => {
    if (p.normal !== "left") return []
    const supportingWidth = getSupportingWidth(map, p)
    const placeInReverse = Math.random() < 0.5
    const grid = Array.from({ length: p.h }, () => Array(p.w).fill(null))
    Array.from({ length: p.h }, (_, row) => {
        const y = placeInReverse ? p.h - 1 - row : row
        const fullWidth = supportingWidth[row] === 1
        const w = fullWidth ? p.w: (Math.random() < 0.5 ? rand(p.w): skewedRand(p.w))
        const x0 = skewedRand(p.w - w, 1) - 1
        for (let i = 0; i < w; i++) {
            const x = x0 + (p.w - 1 - i)
            grid[y][x] = { x: p.x + x, y: y + p.y }
        }
    })
    return grid.flat().filter(x => !!x)
}

const generateBottomTiles = (map, p) => {
    if (p.normal !== "bottom") return []
    const supportingWidth = getSupportingWidth(map, p)
    const placeInReverse = Math.random() < 0.5
    const grid = Array.from({ length: p.h }, () => Array(p.w).fill(null))
    Array.from({ length: p.w }, (_, col) => {
        const x = placeInReverse ? p.w - 1 - col: col
        const fullHeight = supportingWidth[col] === 1
        const h = fullHeight ? p.h: (Math.random() < 0.5 ? rand(p.h): skewedRand(p.h))
        const y0 = skewedRand(p.h - h, 1) - 1
        for (let i = 0; i < h; i++) {
            const y = y0 + (h - 1 - i)
            grid[y][x] = { x: x + p.x, y: p.y + y }
        }
    })
    console.log(grid)
    return grid.flat().filter(x => !!x)
}

const generateTiles= (map, projections) => {
    if (projections.length < 4) return []
    const allTiles = []
    for (const p of projections) {
        if (p.normal === "top" || p.normal === "right") continue

        const tiles = p.normal === "bottom" ? generateBottomTiles(map, p): generateLeftTiles(map, p)
        return tiles
        tiles.forEach(tile => allTiles.push(tile))
        if (allTiles.length > MAX_TILES) break
    }
    return allTiles
}

const projectBackwalls = async (map, block) => {
    const projections = projectCompositeRects(block, map.collisionRects, map)
    const bestProjections = findBestProjections(map, projections)
    const tiles = generateTiles(map, projections)
    tiles.forEach(({ x, y }) => {
        map.setTile(x, y, "bw1", "fg")
    })
    // return tiles
    await map.exportMap()
    process.exit()
}

module.exports = projectBackwalls