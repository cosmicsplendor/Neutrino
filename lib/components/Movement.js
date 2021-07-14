import { circBounds, rectBounds, setLocalPosX, setLocalPosY } from "@utils/entity"
import { atan } from "@utils/math"
export default class Movement {
    static makeMovable(entity, { velX=0, velY=0, accX, accY, fricX, fricY, roll }={}) {
        Object.assign(entity, {
            movable: true,
            velX,
            velY,
            accX, accY, fricX, fricY, roll
        })
        if (roll) { entity.rotation = 0 }
    }
    static updateOffEdge(entity, dt) {
        const entBounds = circBounds(entity)
        const blockBounds = rectBounds(entity.offCorner)
        const normX = (blockBounds.x - (entBounds.x + entBounds.radius)) / entBounds.radius
        const normY = (blockBounds.y - (entBounds.y + entBounds.radius)) / entBounds.radius
        const tanX = normY
        const tanY = -normX
        const dPos = (entity.velX * tanX + entity.velY * tanY) * dt // dPos projection along tangent (this is the amount by which to move along circumference)
        const a0 = atan(normY, normX) // angle of vector from circle's center to the block's corner
        const dA = -dPos / entBounds.radius // rotation angle
        const a1 = a0 + dA // new angle
        if (a1 > Math.PI / 2 || a1 < - Math.PI / 2) { console.log(a1)}
        const dx = entBounds.radius * (1 + Math.cos(a1)) // x-offset on circle which should now snap to the corner
        const dy = entBounds.radius * (1 + Math.sin(a1)) // y-offset on circle which should now snap to the corner
        setLocalPosX(entity, blockBounds.x - dx)
        setLocalPosY(entity, blockBounds.y - dy)

        // entity.prevPosX = entity.pos.x
        // entity.prevPosY = entity.pos.y
        // Movement.update(entity, dt)
        entity.rotation += dA
    }
    static update(entity, dt, t) {
        if (entity.offEdge) {
            return this.updateOffEdge(entity, dt)
        }
        if (entity.accX) {
            entity.velX += entity.accX * dt /  2
        }
        
        if (entity.accY) {
            entity.velY += entity.accY * dt / 2
        }
        
        if (entity.fricX) {
            entity.velX += - entity.fricX * entity.velX * dt / 2
        }
        
        if (entity.fricY) {
            entity.velY *= dt / entity.fricY
        }
        if (entity.roll) {
            entity.rotation += entity.velX * dt / (2 * entity.radius)
        }
        entity.pos.x += entity.velX * dt
        entity.pos.y += entity.velY * dt
    }
}