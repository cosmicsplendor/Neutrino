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

class Inclined {
    name = "inclined"
    projectedVx = 0
    projectedVy = 0
    setTan(x, y) { // inclined surface tangent
        const projectedVel = x * this.controls.speed // projected velocity along inclined plane
        this.projectedVx = projectedVel * x
        this.projectedVy = projectedVel * y
    }
    constructor(controls) {
        this.controls = controls
        this.speed = controls.speed / 4
    }
    onEnter(tanX, tanY) {
        this.setTan(tanX, tanY)
    }
    update(entity) {
        if (this.controls.get("left")) {
            entity.pos.x -= this.projectedVx * this.speed
            entity.pos.y -= this.projectedVy * this.speed
        }
        if (this.controls.get("right")) {
            entity.pos.x += this.projectedVx * this.speed
            entity.pos.y += this.projectedVy * this.speed
        }
    }
}

class OffEdge {
    name = "offEdge"
    constructor(controls, timeout = 0.125) {
        this.controls = controls
        this.timeout = timeout
        this.elapsed = 0
    }
    onEnter(offEdge) {
        this.offEdge = offEdge
        this.elapsed = 0
    }
    update(entity, dt) {
        this.elapsed += dt
        if (this.elapsed > this.timeout) { 
            return this.controls.switchState("jumping")
        }
        if (this.controls.get("left") && this.offEdge === 1 && entity.velX > 0) { // off the right edge
            entity.velX = -50
            entity.velY = -200
            this.controls.switchState("jumping")
            return
        }
        if (this.controls.get("right") && this.offEdge === -1 && entity.velX < 0) { // off the left edge 
            entity.velX = 50
            entity.velY = -200
            this.controls.switchState("jumping")
            return
        }
        if (this.controls.get("up")) {
            this.controls.switchState("jumping")
            entity.velY = this.controls.jumpVel
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
            entity.velY = this.controls.jumpVel
        }
        if (this.controls.get("axn", "pressed")) {
            spawnBullet({ x: entity.pos.x + entity.width, y: entity.pos.y + entity.height / 2 }, this.explosionSFX)
        }
    }
}

class PlayerKeyControls extends KeyControls {
    projectedVx = 0
    projectedVy = 0
    stateSwitched = false // a helper flag for preventing multiple state updates every frame making sure the first one gets precendence 
    jumpVel = -350
    constructor(speed=100) {
        super(mappings)
        this.speed = speed
        this.states = {
            offEdge: new OffEdge(this),
            jumping: new Jumping(this),
            rolling: new Rolling(this),
            inclined: new Inclined(this)
        }
        this.switchState("jumping")
    }
    reset() {
        super.reset()
        this.stateSwitched = false
    }
    switchState(name, ...params) {
        if (this.stateSwitched) { return } // disallow state switching more than once every frame
        this.state = this.states[name]
        this.stateSwitched = true
        this.state.onEnter && this.state.onEnter(...params)
    }
    update(entity, dt) {
        this.state.update(entity, dt)
        this.reset()
    }
}

export default PlayerKeyControls