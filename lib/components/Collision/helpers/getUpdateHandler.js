import getResolver from "./getResolver"

export default (entity, block, { rigid = false, collision, wallJump=false }) => {
    if (!rigid) { // default update handler
        return () => collision.test(collision.onHit)
    }
    const resolver = getResolver(entity, block)
    return () => { // update handler with collison resolution logic
        const movementX = entity.pos.x - entity.prevPosX
        const movementY = entity.pos.y - entity.prevPosY
        let xResolved = false
        
        entity.pos.y = entity.prevPosY // undoing y movement so we can test x collision first
        movementX && collision.test(block => {
            resolver.resolveX(entity, block, movementX)
            collision.onHit(block, { x: movementX })
            xResolved = true
        })

        if (xResolved && wallJump) { return }

        entity.pos.y += movementY // redoing y movement
        movementY && collision.test(block => {
            /**
             * imprecise floating point calculation is responsible for this weird glitch
             * because of this, the collision is resolved to an imprecise position, off by just a factor of about 10^-12
             * in this case, even after the code resolves x collision, entity still tests positive for aabb test
             * and as a result y movement gets falsely blamed responsible for collision. This, in turn, teleports our entity from the left to the top of the block 
             * all this is the result of calculating global pos with camera as the root node. Since camera itself moves, it has a floating point coordinates,
             * so when performing global block bounds calculation, x and y values get rounded off. thus the collision sometimes resolves to imprecise local coordinates, 
             * hence resulting in this messy situation.
             * 
             * Besides, movable objects usually have extremely precise floating point coordinates (because movement parameters calculations depend on very precise dt given by request anim frame)
             * when adding an integer to this number (movableEntity.pos.x + movableEntity.width), occasionally one or more final digits get inconsistently rounded off, which often fools our
             * collision detection test. That way, we again end up with a buggy system.
             * 
             * to address these issues:
             * 1. to avoid the first bug, movable entities must not have parents with floating point coordinates. For this, the following should hold true:
             *      movable entities's parent should preferably be static 
             *      or their movement must be constrained to integer coordinates 
             *      or the movable entities should be direct decendants of the root node
             *      and the camera position (or the root node) must be an integer
             *    besides, entity dimensions cannot be floats
             * 2. to avoid the second bug, while performing collision test with a movable rigid body, the floating point coordinates should be stripped to low enough precision (in most cases, up to 4 decimal places) 
             */
            resolver.resolveY(entity, block, movementY)
            collision.onHit(block, { y: movementY })
        })
    }
}