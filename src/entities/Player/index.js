import { Rect } from "@lib"
import config from "@config"
import Collision from "@components/collision"

const collisionCallback = (player, block) => {
}

class Player extends Rect {
    constructor({ fill="#ffffff", blocks, ...rectProps }) {
        super({ ...rectProps })
        this.fill = fill
        this.vel = { x: 0, y: 0 }
        this.pos.x = (config.viewport.width - this.width)  / 2
        this.pos.y = (config.viewport.height - this.height)  / 2 - 300


        this.collision = new Collision({ entity: this, blocks, callback: collisionCallback })
    }
    update(dt) {
        const initPos = { ...this.pos }
        this.vel.y += config.acceleration * dt / 2
        this.pos.y += this.vel.y * dt
        this.collision.update({ from: initPos, to: this.pos })
    }
}

export default Player