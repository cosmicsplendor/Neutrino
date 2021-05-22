import Rect from "@lib/entities/Rect"
import config from "@config"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import PlayerKeyControls from "./PlayerKeyControls"
import { sign } from "@utils/math"

class Player extends Rect {
    constructor({ fill="coral", speed=100, ...rectProps }) {
        super({ ...rectProps })
        this.fill = fill
        this.pos.x = (config.viewport.width - this.width)  / 2
        this.pos.y = (config.viewport.height - this.height)  / 2 - 300
        // this.hitbox = { x: 2, y: 2, width: rectProps.width - 4, height: rectProps.height - 4 }
        // this.debug = true

        this.keyControls = new PlayerKeyControls(speed)
        this.wallCollision = new Collision({ entity: this, blocks: "wall", resolve: true, onHit: (block, movement) => {
            // if (movement.x) { 
            //     block.velX = sign(movement.x) * speed
            // }
            // if (movement.y) {
            //     // block.pos.y += movement.y / 2
            // }
        } })
        this.crateCollision = new Collision({ entity: this, block: "crate", resolve: true, onHit: (block, movement) => {
            if (movement.x) {
                block.velX = sign(movement.x) * speed
            }
        }})

        Movement.makeMovable(this, { accY: config.gravity })
    }
    update(dt) {
        this.keyControls.update(this, dt)
        Movement.update(this, dt)
        this.crateCollision.update()
        this.wallCollision.update()
    }
}

export default Player