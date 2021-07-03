import { shapes, detectShape } from "@lib/utils/entity"
import aabbResolver from "./resolvers/aabb"
import circAabbResolver from "./resolvers/circAabb"
import circPlankResolver from "./resolvers/circPlank"

export default (entity, block, movable) => {
    const entityShape = detectShape(entity)
    const blockShape = detectShape(block)
    if (entityShape === shapes.RECT && blockShape === shapes.RECT) {
        return aabbResolver
    }
    if (entityShape === shapes.CIRC && blockShape === shapes.RECT) {
        return circAabbResolver
    } 
    if (entityShape === shapes.CIRC && blockShape === shapes.PLANK) {
        return circPlankResolver
    }
    throw new Error(`No resolver found for shapes ${entityShape} and ${blockShape}`)
}