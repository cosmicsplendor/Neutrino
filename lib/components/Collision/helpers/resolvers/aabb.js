import { rectBounds, getHitbox, setLocalPosX, setLocalPosY } from "@lib/utils/entity"

export default {
    resolveX: ({ entity, block, movement, restitution }) => {
        const blockBounds = rectBounds(block)
        const hb = getHitbox(entity)
        entity.velX *= -restitution
        if (movement.x > 0) { // collision with the left edge
            setLocalPosX(entity, blockBounds.x - hb.width - hb.x)
            return
        }
        // collision with the right edge
        setLocalPosX(entity, blockBounds.x + blockBounds.width - hb.x)
    },
    resolveY: ({ entity, block, movement, restitution }) =>{
        const blockBounds = rectBounds(block)
        const hb = getHitbox(entity)
        entity.velY *= -restitution
        if (movement.y > 0) { // collision with the top edge
            setLocalPosY(entity, blockBounds.y - hb.height - hb.y)
            return
        }
        // collision with the bottom edge
        setLocalPosY(entity, blockBounds.y + blockBounds.height - hb.y )
    }
}
