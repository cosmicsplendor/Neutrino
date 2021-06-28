import { clamp } from "@utils/math"
import { rectBounds, circBounds, setLocalPosX, setLocalPosY } from "@lib/utils/entity"

export default  Object.freeze({
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
        entity.velX = movable ? entity.velX: 0
        movable && (block.unduePosXUpdate = movementX)
        // entity.rotation = entity.prevRot
        if (movementX > 0) { // collision with the left edge
            return setLocalPosX(entity, blockBounds.x - hc.x - 2 * hc.radius + xOffset)
        }
        // collision with the right edge
        setLocalPosX(entity, blockBounds.x + blockBounds.width - hc.x - xOffset)
    },
    resolveY: (entity, block, movementY) => {
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
            return setLocalPosY(entity, blockBounds.y - hc.y - 2 * hc.radius + yOffset)
        }
        // collision with the bottom edge
        setLocalPosY(entity, blockBounds.y + blockBounds.height - hc.y - yOffset)
    }
})
