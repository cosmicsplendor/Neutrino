import Collision from "@lib/components/Collision"
import { math } from "@lib"

class PlayerCollision extends Collision {
    constructor({ entity, blocks, callback = () => {} }) {
        super({ entity, blocks, callback })
    }
    update() {
        const { entity } = this
        const movement = { x: entity.pos.x - entity.prevPos.x, y: entity.pos.y - entity.prevPos.y }

        entity.pos.y -= movement.y // undoing y movement so we can test x collision first
        movement.x && this.test(block => {
            const blockBounds = math.rectBounds(block)
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
            const blockBounds = math.rectBounds(block)
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