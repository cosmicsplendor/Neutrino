export default class Movement {
    static makeMovable(entity, { velX=0, velY=0, accX, accY, fricX, fricY, roll }={}) {
        Object.assign(entity, {
            movable: true,
            velX,
            velY,
            accX, accY, fricX, fricY, roll
        })
    }
    static update(entity, dt) {
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
        entity.pos.x += entity.velX * dt
        entity.pos.y += entity.velY * dt
        if (entity.roll) {
            entity.rotation += entity.velX * dt / (2 * entity.radius)
        }
    }
}