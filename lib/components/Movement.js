import { stripFloat } from "@utils/math" 
export default class Movement {
    static makeMovable(entity, { velX=0, velY=0, ...rest }={}) {
        Object.assign(entity, {
            movable: true,
            velX,
            velY,
            ...rest
        })
    }
    static update(entity, dt) {
        if (entity.accX) {
            entity.velX += entity.accX * dt /  2
        }

        if (entity.accY) {
            entity.velY += entity.accY * dt / 2
        }

        if (entity.frictionX) {
            entity.velX += - entity.frictionX * entity.velX * dt / 2
        }

        if (entity.frictionY) {
            entity.velY *= dt / entity.frictionY
        }

        entity.pos.x += entity.velX * dt
        entity.pos.y += entity.velY * dt
    }
}