import { Node } from "@lib"

import { rectBounds, circBounds, setLocalPosX, setLocalPosY } from "@lib/utils/entity"

export default  Object.freeze({
    resolveX: (entity, block, movementX, movable) => {
        // debugger
        const blockBounds = rectBounds(block)
        const hc = entity.hitCirc
        entity.velX = movable ? entity.velX: 0
        movable && (block.unduePosXUpdate = movementX * 0.5)
        entity.rotation = entity.prevRot
        if (movementX > 0) { // collision with the left edge
            setLocalPosX(entity, blockBounds.x - 2 * hc.radius - hc.x)
            return
        }
        // collision with the right edge
        setLocalPosX(entity, blockBounds.x + blockBounds.width - hc.x)
    },
    resolveY: (entity, block, movementY) => {
        const blockBounds = rectBounds(block)
        const hc = entity.hitCirc
        entity.velY = 0
        if (movementY > 0) { // collision with the top edge
            const entBounds = circBounds(entity)
            if (entBounds.x + hc.radius > blockBounds.x + blockBounds.width) {
                const diff = entBounds.x + hc.radius - (blockBounds.x + blockBounds.width)
                setLocalPosY(entity, blockBounds.y - hc.radius - Math.sqrt(hc.radius * hc.radius - diff * diff)  - hc.y)
                entity.velX += 5
                return
            }
            setLocalPosY(entity, blockBounds.y - 2 * hc.radius - hc.y)
            return
        }
        // collision with the bottom edge
        setLocalPosY(entity, blockBounds.y + blockBounds.height - hc.y )
    }
})
