const { scoreArea, scoreSupportingWidth, scoreWidth } = require("./scoreFns");
const projectCompositeRects = require("../../utils/projectCompositeRects");

const getSupportingWidth = (map, p) => {
    if (p.normal === "left") {
        return Array(p.h).fill(p.y).map((py, i) => map.getTile(p.x - 1, py + i) ? 1: 0)
    }
    if (p.normal === "right") {
        return Array(p.h).fill(p.y).map((py, i) => map.getTile(p.x + p.w, py + i) ? 1: 0)
    }
    if (p.normal === "top") {
        return Array(p.w).fill(p.x).map((px, i) => map.getTile(px + i, p.y - 1) ? 1: 0)
    }
    if (p.normal === "bottom") {
        return Array(p.w).fill(p.x).map((px, i) => {
            const sw = map.getTile(px + i, p.y + p.h) ? 1: 0
            return sw
        })
    }
    return 0
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

const projectBackwalls = async (map, block) => {
    /**
     * 1. project the edges of the block and group by normal direction
     * 2. for each normal direction compute supporting width and use it to compute supportingWidth score 
     * 3. compute the total number of tiles occupied and use it to get numOfBlocks score
     * 4. use power distribution to compute width score
     * 5. consider each scores as a component of an unit vector and compute absolute score by taking the square root of their sums squared
     * 6. return the group with the highest score, and let the user decide whether to construct back wall based on the min score threshold and the max scoring group
     */
    const projections = projectCompositeRects(block, block.collisionRects, map)
    const bestProjections = findBestProjections(map, projections)
    console.log(bestProjections)
    process.exit()
}

module.exports = projectBackwalls