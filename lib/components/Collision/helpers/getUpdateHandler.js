import getResolver from "./getResolver"

export default (entity, block, { cheap }) => {
    const resolver = getResolver(entity, block)
    if (!!cheap || !resolver) { // default update handler
        return collision => collision.test(collision.onHit)
    }
    return collision => { // update handler with collison resolution logic
        const { entity, restitution } = collision
        const movement = { x: entity.pos.x - entity.prevPos.x, y: entity.pos.y - entity.prevPos.y }

        entity.pos.y -= movement.y // undoing y movement so we can test x collision first
        movement.x && collision.test(block => {
            resolver.x({ entity, block, movement, restitution: restitution || 0 })
            collision.onHit(block)
        })

        entity.pos.y += movement.y // redoing y movement
        movement.y && collision.test(block => {
            resolver.y({ entity, block, movement, restitution: restitution || 0 })
            collision.onHit(block)
        })
    }
}