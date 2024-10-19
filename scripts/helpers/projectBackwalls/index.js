const { scoreArea, scoreSupportingWidth, scoreWidth } = require("./scoreFns");
const projectCompositeRects = require("../../utils/projectCompositeRects");

const getSupportingWidth = (map, p) => {
    if (p.edge === "left") {
        return Array(p.h).fill(p.y).map((py, i) => map.getTile(p.x - 1, py + i) ? 1: 0)
    }
    if (p.edge === "right") {
        return Array(p.h).fill(p.y).map((py, i) => map.getTile(p.x + p.w, py + i) ? 1: 0)
    }
    if (p.edge === "top") {
        return Array(p.w).fill(p.x).map((px, i) => map.getTile(px + i, p.y - 1) ? 1: 0)
    }
    if (p.edge === "bottom") {
        return Array(p.w).fill(p.x).map((px, i) => map.getTile(px + i, p.y + p.h) ? 1: 0)
    }
    return 0
}

const computeScore = (map, projections) => {
    const area = projections.reduce((area, p) => area + p.w * p.h, 0)
    const width = projections.reduce((width, p) => {
        const w = p.normal == "left" || p.normal === "right" ? p.h: p.w
        return width + w
    }, 0)
    const height = projections.reduce((height, p) => {
        const h = p.normal == "left" || p.normal === "right" ? p.w: p.h
        return height + h
    }, 0) / projections.length
    const supportingWidth = projections.reduce((sum, p) => {
        const sw = getSupportingWidth(map, p).filter(b => b).length
        return sum + sw
    }, 0)
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
        .reduce((best, projections) => projections.score > best.score ? projections: best, { score: 0, projections: [] })
    return best
}

const projectBackwalls = async (map, block) => {
    /**
     * 1. project the edges of the block and group by normal direction
     * 2. for each normal direction compute supporting width and use it to compute supportingWidth score 
     * 3. compute the total number of tiles occupied and use it to get numOfBlocks score
     * 4. use power distribution to compute width score
     * 5. consider each scores as a component of an unit vector and compute absolute score by taking the square root of their sums squared
     * 6. return the group with the highest score, and let the user decide whether to construct back wall based on the min score threshold and the max scoring group
     */
    const projectionsByNormal = projectCompositeRects(block, block.collisionRects, map).reduce((group, projection) => {
        const projections = group[projection.normal] ?? []
        projections.push(projection)
        return group
    }, {})
    const bestProjections = findBestProjections(map, projectionsByNormal)
    console.log(bestProjections)
    process.exit()
}

module.exports = projectBackwalls