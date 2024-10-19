import { scoreNumOfBlocks, scoreSupportingWidth, scoreWidth } from "./scoreFns";
const projectCompositeRects = require("scripts/utils/projectCompositeRects");
const projectBackwalls = (map, block) => {
    /**
     * 1. project the edges of the block and group by normal direction
     * 2. for each normal direction compute supporting width and use it to compute supportingWidth score 
     * 3. compute the total number of tiles occupied and use it to get numOfBlocks score
     * 4. use power distribution to compute width score
     * 5. consider each scores as a component of an unit vector and compute absolute score by taking the square root of their sums squared
     * 6. return the group with the highest score, and let the user decide whether to construct back wall based on the min score threshold and the max scoring group
     */
}

export default projectBackwalls