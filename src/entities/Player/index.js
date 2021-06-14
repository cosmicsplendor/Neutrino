import Texture from "@lib/entities/Texture"
import config from "@config"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import PlayerKeyControls from "./PlayerKeyControls"
import { sign } from "@utils/math"
import crateImgUrl from "@assets/images/carton.png"
import { COL_RECTS } from "@lib/constants"

class Player extends Texture {
    constructor({ fill="coral", speed = 150, width = 80, height = 80, ...nodeProps }) {
        super({ imgId: crateImgUrl, ...nodeProps })
        this.width = width
        this.height = height
        this.pos.y = 0
        this.smooth = true

        this.keyControls = new PlayerKeyControls(speed)
        this.wallCollision = new Collision({ entity: this, blocks: COL_RECTS, rigid: true, movable: false, onHit: (block, movement) => {
            this.jumping = false
            if (movement.x) { 
            }
            if (movement.y) {
                if (movement.y < 0) {
                    this.jumping = false
                }
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
            }
        }})
        Movement.makeMovable(this, { accY: config.gravity })
    }
    set explosionSFX(val) {
        this.keyControls.explosionSFX = val
    }
    update(dt, t) {
        this.keyControls.update(this, dt)
        Movement.update(this, dt)
        this.crateCollision.update()
        this.wallCollision.update()
    }
}

export default Player