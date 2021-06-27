import KeyControls from "@lib/components/KeyControls"
import spawnBullet from "@entities/factories/spawnBullet"

const mappings = Object.freeze({
    left: [ 37, 65 ],
    up: [ 38, 87 ],
    right: [ 39, 68 ],
    down: [ 40, 83 ],
    axn: 32
})

class PlayerKeyControls extends KeyControls {
    explosionSFX = null
    constructor(speed=100) {
        super(mappings)
        this.speed = speed
    }
    update(entity, dt) {
        if (this.get("left")) {
            entity.velX -= this.speed
        }
        if (this.get("right")) {
            entity.velX += this.speed
        }
        if (this.get("up") && !entity.jumping) {
            entity.jumping = true
            entity.velY = -400
        }
        if (this.get("down")) {
            entity.velY += 75
        }
        if (this.get("axn", "pressed")) {
            spawnBullet({ x: entity.pos.x + entity.width, y: entity.pos.y + entity.height / 2 }, this.explosionSFX)
        }
        this.reset()
    }
}

export default PlayerKeyControls