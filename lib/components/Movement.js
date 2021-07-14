import { circBounds } from "@utils/entity"
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
            const normX = ((entBounds.x + entBounds.radius) - entity.offCornerX) / entBounds.radius
            const normY = ((entBounds.y + entBounds.radius) - entity.offCornerY) / entBounds.radius
            const tanX = normY
            const tanY = -normX
            const dPos = (entity.velX * tanX + entity.velY * tanY) * dt // dPos projection along tangent (this is the amount by which to move along circumference)
            const a0 = atan(normY, normX) // angle of vector from circle's center to the block's corner
            const dA = dPos / entBounds.radius // rotation angle
            const a1 = a0 + dA // new angle
            const ocx0 = entity.offCornerX - entBounds.x // 1-D vec from top-left corner of the circle to the block corner 
            const ocy0 = entity.offCornerY - entBounds.y // 1-D vec from top-left corner of the circle to the block corner
            const ocx1 = entBounds.radius + entBounds.radius * Math.cos(a1) // x-offset on circle which should now snap to the corner
            const ocy1 = entBounds.radius + entBounds.radius * Math.sin(a1) // y-offset on circle which should now snap to the corner
            // console.log(ocx0 - ocx1)
            console.log(a0 * 180 / Math.PI)
            entity.x += ocx0 - ocx1
            entity.y += ocy0 - ocy1

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