import Rect from "@lib/entities/Rect"
import config from "@config"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import PlayerKeyControls from "./PlayerKeyControls"

class Player extends Rect {
    constructor({ fill="coral", ...rectProps }) {
        super({ ...rectProps })
        this.fill = fill
        this.vel = { x: 0, y: 0 }
        this.acc = { x: 0, y: config.gravity }
        this.pos.x = (config.viewport.width - this.width)  / 2
        this.pos.y = (config.viewport.height - this.height)  / 2 - 300
        // this.hitbox = { x: -10, y: -10, width: 40, height: 40 }
        // this.debug = true

        this.keyControls = new PlayerKeyControls()
        this.wallCollision = new Collision({ entity: this, blocks: "wall" })
    }
    update(dt) {
        this.keyControls.update(this, dt)
        Movement.update(this, dt)
        this.wallCollision.update()
    }
}

export default Player