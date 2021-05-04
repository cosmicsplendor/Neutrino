export default class Movement {
    static update(entity, dt) {
        const { pos, vel, acc } = entity

        if (acc.x !== 0) {
            vel.x += acc.x * dt /  2
        }

        if (acc.y !== 0) {
            vel.y += acc.y * dt / 2
        }

        pos.x += vel.x * dt
        pos.y += vel.y * dt
    }
}