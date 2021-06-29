import Texture from "@lib/entities/Texture"
import config from "@config"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import PlayerKeyControls from "./PlayerKeyControls"
import crateImgUrl from "@assets/images/carton.png"
import { COL_RECTS } from "@lib/constants"

class Player extends Texture {
    constructor({ fill="coral", speed = 20, width = 64, height = 64, ...nodeProps }) {
        super({ imgId: crateImgUrl, ...nodeProps })
        this.width = width
        this.height = height
        this.radius = width / 2
        this.hitCirc = { x: 0, y: 0, radius: this.radius }
        this.rotation = 0
        this.anchor = {
            x: width / 2,
            y: height / 2
        }
        this.pos.y = 100

        this.keyControls = new PlayerKeyControls(speed)
        this.wallCollision = new Collision({ entity: this, blocks: COL_RECTS, rigid: true, movable: false, onHit: (block, movX, movY) => {
            if (movY) {
                if (movY > 0) {
                    this.keyControls.switchState("rolling")
                }
            }
        } })
       
        this.crateCollision = new Collision({ entity: this, block: "crate", rigid: true, onHit: (block, movX, movY) => {
            if (movX) {
                // block.velX += sign(movX)
            }
            if (movY) {
                if (movY > 0) {
                    this.keyControls.switchState("rolling")
                }
            }
        }})
        
        Movement.makeMovable(this, { accY: config.gravity, roll: true, fricX: 1 })
    }
    set offEdge(val) {
        this.keyControls.offEdge = val
        this.keyControls.switchState("offEdge")
    }
    update(dt, t) {
        this.keyControls.update(this, dt)
        Movement.update(this, dt)
        this.crateCollision.update()
        this.wallCollision.update()
    }
}

export default Player