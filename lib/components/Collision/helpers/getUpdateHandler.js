import getResolver from "./getResolver"

export default (entity, block, { resolve=false, restitution, collision }) => {
    if (!resolve) { // default update handler
        return collision => collision.test(collision.onHit)
    }
    const resolver = getResolver(entity, block)
    return () => { // update handler with collison resolution logic
        const movement = { x: entity.pos.x - entity.prevPos.x, y: entity.pos.y - entity.prevPos.y }

        entity.pos.y -= movement.y // undoing y movement so we can test x collision first
        movement.x && collision.test(block => {
            resolver.resolveX({ entity, block, movement, restitution: restitution || 0 })
            collision.onHit(block, { x: movement.x })
        })

        entity.pos.y += movement.y // redoing y movement
        movement.y && collision.test(block => {
            resolver.resolveY({ entity, block, movement, restitution: restitution || 0 })
            collision.onHit(block, { y: movement.y })
        })
    }
}