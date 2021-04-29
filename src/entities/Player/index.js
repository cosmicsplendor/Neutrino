import { Rect, Node, math } from "@lib"
import config from "@config"
import PlayerCollision from "@components/PlayerCollision"
import PlayerKeyControls from "@components/PlayerKeyControls"

class Player extends Rect {
    constructor({ fill="coral", ...rectProps }) {
        super({ ...rectProps })
        this.fill = fill
        this.vel = { x: 0, y: 0 }
        this.acc = { x: 0, y: config.gravity }
        this.pos.x = (config.viewport.width - this.width)  / 2
        this.pos.y = (config.viewport.height - this.height)  / 2 - 300

        this.keyControls = new PlayerKeyControls()
        this.collision = new PlayerCollision({ entity: this, blocks: Node.get("wall") })
    }
    update(dt) {
        this.prevPos = { ...this.pos }
        this.keyControls.update(this, dt)
        math.move(this, dt)
        this.collision.update(this)
    }
}

export default Player