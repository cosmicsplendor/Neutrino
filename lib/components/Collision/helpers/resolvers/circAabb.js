import { Node } from "@lib"
import { rectBounds } from "@lib/utils/entity"

export default {
    x: ({ entity, block, movement, restitution }) => {
        entity.vel.x *= -restitution
        const blockBounds = rectBounds(block)
        if (movement.x > 0) { // collision with the top edge
            Node.setGlobalPos(entity, )
            return
        }
        // collision with the bottom edge
    }
}