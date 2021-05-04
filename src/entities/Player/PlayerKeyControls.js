import { KeyControls } from "@lib/components"
import spawnBullet from "@entities/factories/spawnBullet"

const mappings = Object.freeze({
    left: [ 37, 65 ],
    up: [ 38, 87 ],
    right: [ 39, 68 ],
    down: [ 40, 83 ],
    axn: 32
})

class PlayerKeyControls extends KeyControls {
    constructor() {
        super(mappings)
        this.speed = 100
    }
    update(entity, dt) {
        if (this.get("left")) {
            entity.pos.x -= this.speed * dt
        }
        if (this.get("right")) {
            entity.pos.x += this.speed * dt
        }
        if (this.get("up")) {
            entity.vel.y = -200
        }
        if (this.get("down")) {
            entity.vel.y += 75
        }
        if (this.get("axn", "pressed")) {
            spawnBullet({ x: entity.pos.x + entity.width, y: entity.pos.y + entity.height / 2 })
        }
        this.reset()
    }
}

export default PlayerKeyControls