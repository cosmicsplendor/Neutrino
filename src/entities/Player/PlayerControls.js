import KeyControls from "@lib/components/controls/KeyControls"
import TouchControls from "@lib/components/controls/TouchControls"
import { clamp } from "@utils/math"

const defaultMappings = Object.freeze({
    left: [ 37, 65 ],
    up: [ 38, 87 ],
    right: [ 39, 68 ],
    down: [ 40, 83 ],
    axn: 32
})

const extendPalyerControls = _Super => class PlayerControls extends _Super {
    stateSwitched = false // a helper flag for preventing multiple state updates every frame making sure the first one gets the precendence 
    jmpVel = -260
    maxJvelInc = 5
    mxJmpVel = 375
    constructor(speed=100, mappings=defaultMappings) {
        super(mappings)
        this.speed = speed
        this.states = {
            offEdge: new OffEdge(this),
            jumping: new Jumping(this),
            rolling: new Rolling(this),
        }
        this.state = this.states.jumping
    }
    cleanup() {
        this.reset() // reset pressed attribute on all keys
        this.stateSwitched = false // reset stateSwitched for the next frame
    }
    switchState(name, ...params) {
        if (this.stateSwitched || name === this.state.name) { return } // disallow state switching more than once every frame
        this.state.onExit && this.state.onExit() // execute previous state's onExit hook, in case there's one
        this.state = this.states[name]
        this.state.onEnter && this.state.onEnter(...params)
        this.stateSwitched = true
    }
    update(entity, dt) {
        this.state.update(entity, dt)
        this.cleanup()
    }
}

export const PlayerKeyControls = extendPalyerControls(KeyControls)
export const PlayerTouchControls = extendPalyerControls(TouchControls)

class Rolling {
    name = "rolling"
    constructor(controls) {
        this.controls = controls
    }
    onEnter() {
    }
    update(entity, dt) {
        if (this.controls.get("left")) {
            entity.velX -= (entity.velX > 0 ? 3 : 1) * this.controls.speed * dt 
        }
        if (this.controls.get("right")) {
            entity.velX += (entity.velX < 0 ? 3 : 1) * this.controls.speed * dt 
        }
        if (this.controls.get("axn")) {
            this.controls.switchState("jumping", entity)
        }
        // }
    }
}


class Jumping {
    name = "jumping"
    constructor(controls) {
        this.controls = controls
    }
    onEnter(entity) {
        entity.velY += this.controls.jmpVel
        this.limitReached = false
    }
    onHalt() { // jump prematurely obstructed (mostly by collision with bottom edge of a rect)
        this.limitReached = true
    }
    update(entity, dt) {
        if (this.controls.get("left")) {
            entity.velX -= (entity.velX > 0 ? 3 : 1) * this.controls.speed * dt 
        }
        if (this.controls.get("right")) {
            entity.velX += (entity.velX < 0 ? 3 : 1) * this.controls.speed * dt 
        }
        if (this.controls.get("axn")) {
            if (entity.velY < -this.controls.mxJmpVel) { this.limitReached = true }
            if (this.limitReached) { return }
            entity.velY += this.controls.jmpVel * ( Math.min(5.5, (entity.velY * entity.velY) / 100)) * dt 
        } else { this.limitReached = true } // if the player has stopped pressing "axn" key, player won't gain anymore velocity in this jump
    }
}

class OffEdge {
    name = "offEdge"
    constructor(controls, timeout = 0.125) {
        this.controls = controls
        this.timeout = timeout
    }
    update(entity, dt) {
        if (this.controls.get("left")) { // off the right edge
            entity.velX -= this.controls.speed * dt
        }
        if (this.controls.get("right")) { // off the left edge 
            entity.velX += this.controls.speed * dt
        }
        entity.velX = clamp(-100, 100, entity.velX) 
    }
}