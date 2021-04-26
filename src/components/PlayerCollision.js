import Collision from "@lib/components/Collision"
import { math } from "@lib"

class PlayerCollision extends Collision {
    constructor({ entity, blocks, callback = () => {} }) {
        super({ entity, blocks, callback })
    }
    update({ from, to }) {
        const { entity } = this
        const movement = { x: to.x - from.x, y: to.y - from.y }

        entity.pos.y -= movement.y // undoing y movement so we can test x collision first
        movement.x && this.test(block => {
            const blockBounds = math.bounds(block)
            entity.vel.x = 0
            if (movement.x > 0) { // collision with the left edge
                entity.pos.x = blockBounds.x - entity.width
                return
            }
            // collision with the right edge
            entity.pos.x = blockBounds.x + blockBounds.width
        })

        entity.pos.y += movement.y // redoing y movement
        movement.y && this.test(block => {
            const blockBounds = math.bounds(block)
            entity.vel.y = 0
            if (movement.y > 0) { // collision with the top edge
                entity.pos.y = blockBounds.y - entity.height
                return
            }
            // collision with the bottom edge
            entity.pos.y = blockBounds.y + blockBounds.height
        })
    }
}

export default PlayerCollision