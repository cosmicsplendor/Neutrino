import KeyControls from "@lib/components/KeyControls"
import spawnBullet from "@entities/factories/spawnBullet"

const mappings = Object.freeze({
    left: [ 37, 65 ],
    up: [ 38, 87 ],
    right: [ 39, 68 ],
    down: [ 40, 83 ],
    axn: 32
})

class Jumping {
    name = "jumping"
    constructor(controls) {
        this.controls = controls
    }
    update(entity) {
        if (this.controls.get("left")) {
            entity.velX -= this.controls.speed
        }
        if (this.controls.get("right")) {
            entity.velX += this.controls.speed
        }
    }
}

class OffEdge {
    name = "offEdge"
    constructor(controls, timeout = 1) {
        this.controls = controls
    }
    update(entity) {
        if (this.controls.get("left") && this.keyControls.offEdge === 1 && entity.velX > 0) { // off the right edge
            entity.velX = -50
            entity.velY = -200
            this.controls.switchState("jumping")
            return
        }
        if (this.controls.get("right") && this.keyControls.offEdge === -1 && entity.velX < 0) { // off the left edge 
            entity.velX = 50
            entity.velY = -200
            this.controls.switchState("jumping")
            return
        }
    }
}

class Rolling {
    name = "rolling"
    constructor(controls) {
        this.controls = controls
    }
    update(entity) {
        if (this.controls.get("left")) {
            entity.velX -= this.controls.speed
        }
        if (this.controls.get("right")) {
            entity.velX += this.controls.speed
        }
        if (this.controls.get("up")) {
            this.controls.switchState("jumping")
            entity.velY = -400
        }
        if (this.controls.get("axn", "pressed")) {
            spawnBullet({ x: entity.pos.x + entity.width, y: entity.pos.y + entity.height / 2 }, this.explosionSFX)
        }
    }
}

class PlayerKeyControls extends KeyControls {
    offEdge = null
    constructor(speed=100) {
        super(mappings)
        this.speed = speed
        this.states = {
            offEdge: new OffEdge(this),
            jumping: new Jumping(this),
            rolling: new Rolling(this)
        }
        this.switchState("jumping")
    }
    switchState(name) {
        this.state = this.states[name]
        if (!this.state) { 
            throw new Error(`Undefined state: ${name}`)
        }
    }
    update(entity, dt) {
        this.state.update(entity, dt)
        this.reset()
    }
}

export default PlayerKeyControls