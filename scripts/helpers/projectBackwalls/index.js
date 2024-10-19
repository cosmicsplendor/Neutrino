import { scoreArea, scoreSupportingWidth, scoreWidth } from "./scoreFns";
const projectCompositeRects = require("scripts/utils/projectCompositeRects");

const getSupportingWidth = (map, p) => {
    if (p.edge === "left") {

    }
    if (p.edge === "right") {

    }
    if (p.edge === "top") {

    }
    if (p.edge === "bottom") {

    }
    return 0
}

const computeScore = (map, projections) => {
    const area = projections.reduce((area, p) => area + p.w * p.h, 0)
    const width = projections.reduce((width, p) => {
        const w = p.normal == "left" || p.normal === "right" ? p.w: p.h
        return width + w
    }, 0)
    const supportingWidth = projections.reduce((sum, p) => {
        const sw = getSupportingWidth(map, p)
        return sum + sw
    }, 0)
    return Math.sqrt(area * area + width * width + supportingWidth * supportingWidth)
}

const findBestProjecions = (map, projectionsByNormal) => {
    for (const projections of Object.values(projectionsByNormal)) {
        const score = computeScore(map, projections)
    }
}

const projectBackwalls = (map, block) => {
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
    const bestProjections = findBestProjecions(map, projectionsByNormal)

}

export default projectBackwalls