import Rect from "@lib/entities/Rect"
import config from "@config"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import PlayerKeyControls from "./PlayerKeyControls"
import { sign } from "@utils/math"

class Player extends Rect {
    constructor({ fill="coral", speed=150, ...rectProps }) {
        super({ ...rectProps })
        this.fill = fill
        this.pos.y = (config.viewport.height - this.height)  / 2 - 300
        // this.hitbox = { x: 2, y: 2, width: rectProps.width - 4, height: rectProps.height - 4 }
        // this.debug = true

        this.keyControls = new PlayerKeyControls(speed)
        this.wallCollision = new Collision({ entity: this, blocks: "wall", rigid: true, movable: false, onHit: (block, movement) => {
            this.jumping = false
            if (movement.x) { 
                // block.velX = sign(movement.x) * speed
            }
            if (movement.y) {
                if (movement.y < 0) {
                    this.jumping = false
                }
                // debugger
                // console.log(movement)
            }
        } })
       
        this.crateCollision = new Collision({ entity: this, block: "crate", rigid: true, onHit: (block, movement) => {
            if (movement.x) {
                block.velX = sign(movement.x) * speed
            }
            if (movement.y) {
                if (movement.y < 0) {
                    this.jumping = false
                }
                // debugger
                // console.log(movement)
            }
        }})

        Movement.makeMovable(this, { accY: config.gravity })
    }
    set explosionSFX(val) {
        this.keyControls.explosionSFX = val
    }
    update(dt) {
        this.keyControls.update(this, dt)
        Movement.update(this, dt)
        this.crateCollision.update()
        this.wallCollision.update()
    }
}

export default Player