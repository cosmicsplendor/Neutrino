import { Node } from "@lib"
import { rectBounds, hitbox } from "@lib/utils/entity"

export default {
    x: ({ entity, block, movement, restitution }) => {
        const blockBounds = rectBounds(block)
        const hb = hitbox(entity)
        entity.vel.x *= -restitution
        if (movement.x > 0) { // collision with the left edge
            Node.setLocalPos(entity, { x: blockBounds.x - hb.width - hb.x})
            return
        }
        // collision with the right edge
        Node.setLocalPos(entity, { x: blockBounds.x + blockBounds.width - hb.x })
    },
    y: ({ entity, block, movement, restitution }) =>{
        const blockBounds = rectBounds(block)
        const hb = hitbox(entity)
        entity.vel.y *= -restitution
        if (movement.y > 0) { // collision with the top edge
            Node.setLocalPos(entity, { y: blockBounds.y - hb.height - hb.y })
            return
        }
        // collision with the bottom edge
        Node.setLocalPos(entity, { y: blockBounds.y + blockBounds.height - hb.y })
    }
}
