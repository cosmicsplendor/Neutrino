import { shapes, detectShape } from "@lib/utils/entity"
import aabbResolver from "./resolvers/aabb"
// import circAabbResolver from "./resolvers/circAabb"

export default (entity, block) => {
    const entityShape = detectShape(entity)
    const blockShape = detectShape(block)

    if (entityShape === shapes.RECT && blockShape === shapes.RECT) {
        return aabbResolver
    }
    return null
}