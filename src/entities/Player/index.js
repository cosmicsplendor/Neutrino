import Texture from "@lib/entities/Texture"
import { Node } from "@lib"
import config from "@config"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import PlayerKeyControls from "./PlayerKeyControls"
import crateImgUrl from "@assets/images/carton.png"
import botHeadImgId from "@assets/images/bot_head.png"
import { COL_RECTS } from "@lib/constants"


class Player extends Texture {
    constructor({ speed = 20, width = 64, height = 64, ...rest }) {
        super({ imgId: crateImgUrl, ...rest })
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
        this.keyControls.switchState("offEdge", val)
    }
    update(dt, t) {
        this.keyControls.update(this, dt)
        Movement.update(this, dt)
        this.crateCollision.update()
        this.wallCollision.update()
    }
}

class UberPlayer extends Node {
    constructor({ id, speed = 20, width = 64, height = 64, ...rest }) {
        super()
        this.body = new Player({ id, speed, width, height, ...rest })
        this.head = new Texture({ imgId: botHeadImgId  }) // adding Head

        this.add(this.body)
        this.add(this.head)
        this.head.update = () => {
            this.head.pos.x = this.body.pos.x + 9
            this.head.pos.y = this.body.pos.y - 22
        }
        this.head.pos.x = 9 // 45
        this.head.pos.y = -16 // 27
        this.head.update()
    }
}

export default UberPlayer