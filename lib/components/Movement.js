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
        const { pos, frictionX, frictionY, accX, accY, } = entity

        if (accX) {
            entity.velX += accX * dt /  2
        }

        if (accY) {
            entity.velY += accY * dt / 2
        }

        if (frictionX) {
            entity.velX += - frictionX * entity.velX * dt / 2
        }

        if (frictionY) {
            entity.velY *= dt / frictionY
        }

        pos.x += entity.velX * dt
        pos.y += entity.velY * dt
    }
}