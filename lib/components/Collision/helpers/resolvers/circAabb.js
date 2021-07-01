import { clamp, sign } from "@utils/math"
import { rectBounds, circBounds, setLocalPosX, setLocalPosY } from "@lib/utils/entity"

export default  Object.freeze({
    oneOff: false,
    resolveX: (entity, block, movementX, movable) => {
        // debugger
        const blockBounds = rectBounds(block)
        const entBounds = circBounds(entity)
        const hc = entity.hitCirc
        const nearestBlockYFromEntCenter = clamp(blockBounds.y, blockBounds.y + blockBounds.height, entBounds.y + hc.radius)
        let xOffset = 0
        if (nearestBlockYFromEntCenter === blockBounds.y || nearestBlockYFromEntCenter === blockBounds.y + blockBounds.height) { // if the circle is off edge
            const offedge = Math.abs(nearestBlockYFromEntCenter - (entBounds.y + hc.radius))
            xOffset = hc.radius - Math.sqrt(hc.radius * hc.radius - offedge * offedge)
        }
        
        const prevPosX = entity.pos.x
        if (movementX > 0) { // collision with the left edge
            setLocalPosX(entity, blockBounds.x - hc.x - 2 * hc.radius + xOffset)
        } else {
            // collision with the right edge
            setLocalPosX(entity, blockBounds.x + blockBounds.width - hc.x - xOffset)
        }
        
        movable && (block.unduePosXUpdate = movementX)
        const dPosX = entity.pos.x - prevPosX
        const normalizedNetMovement = (movementX + dPosX) / movementX
        entity.velX = movable && normalizedNetMovement !== 0 ? entity.velX - 1: 0
        entity.rotation = entity.prevRot + normalizedNetMovement * (entity.rotation - entity.prevRot)
    },
    resolveY: (entity, block, movementY, movable) => {
        const blockBounds = rectBounds(block)
        const hc = entity.hitCirc
        const entBounds = circBounds(entity)
        const nearestBlockXFromEntCenter = clamp(blockBounds.x, blockBounds.x + blockBounds.width, entBounds.x + hc.radius)
        let yOffset = 0
        if (nearestBlockXFromEntCenter === blockBounds.x || nearestBlockXFromEntCenter === blockBounds.x + blockBounds.width) { // if the circle is off edge
            const offedge = Math.abs(nearestBlockXFromEntCenter - (entBounds.x + hc.radius))
            yOffset = hc.radius - Math.sqrt(hc.radius * hc.radius - offedge * offedge)
        }
        entity.velY = 0
        if (movementY > 0) { // collision with the top edge
           if (yOffset) {
                const offWhichEdge = nearestBlockXFromEntCenter === blockBounds.x ? -1: 1
                entity.offEdge = offWhichEdge
                entity.velX += offWhichEdge * entity.accY / 50
                if (movable) { block.velX -= offWhichEdge * entity.accY / 50 }
           }
           return setLocalPosY(entity, blockBounds.y - hc.y - 2 * hc.radius + yOffset)
        }
        // collision with the bottom edge
        setLocalPosY(entity, blockBounds.y + blockBounds.height - hc.y - yOffset)
    }
})
