import Texture from "@lib/entities/Texture"
import config from "@config"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import PlayerKeyControls from "./PlayerKeyControls"
import { sign } from "@utils/math"
import crateImgUrl from "@assets/images/carton.png"

class Player extends Texture {
    constructor({ fill="coral", speed = 150, width = 80, height = 80, ...nodeProps }) {
        super({ url: crateImgUrl, ...nodeProps })
        // this.fill = "lemonchiffon"
        // this.stroke = "orange"
        this.width = width
        this.height = height
        this.pos.y = (config.viewport.height - this.height)  / 2 - 300
        // this.hitbox = { x: 2, y: 2, width: rectProps.width - 4, height: rectProps.height - 4 }
        // this.debug = true
        this.smooth = true

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
                console.log(movement.y)
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