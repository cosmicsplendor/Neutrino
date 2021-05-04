import detectShape, { shapes } from "./detectShape"
import aabbResolver from "./resolvers/aabb"
import circAabbResolver from "./resolvers/circAabb"

export default (entity, block) => {
    const entityShape = detectShape(entity)
    const blockShape = detectShape(block)

    if (entityShape === shapes.RECT && blockShape === shapes.RECT && block.static === true) {
        return resolve(aabbResolver)
    }
    if (entityShape === shapes.CIRC && blockShape === shapes.RECT && block.static === true) {
        return resolve(circAabbResolver)
    }
    return defaultUpdate
}

function resolve(resolver) {
    return function() {
        const { entity, restitution } = this
        const movement = { x: entity.pos.x - entity.prevPos.x, y: entity.pos.y - entity.prevPos.y }

        entity.pos.y -= movement.y // undoing y movement so we can test x collision first
        movement.x && this.test(block => resolver.x({ entity, block, movement, restitution: restitution || 0 }))

        entity.pos.y += movement.y // redoing y movement
        movement.y && this.test(block => resolver.y({ entity, block, movement, restitution: restitution || 0 }))
    }
}

function defaultUpdate() {
    this.test()
}