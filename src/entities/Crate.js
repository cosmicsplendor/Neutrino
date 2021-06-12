import Texture from "@lib/entities/Texture"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import config from "@config"
import { pickOne } from "@utils/math"

import crateImgUrl from "@assets/images/carton.png"
import cartonDarkImg from "@assets/images/cartonDark.png"

class Crate extends Texture {
    constructor({ width = 50, height = 50, ...nodeProps } = {}) {
        super({ imgId: cartonDarkImg, ...nodeProps })
        // this.fill = "lemonchiffon"
        // this.stroke = "orange"
        this.width = width
        this.height = height
        this.smooth = true
        // this.rotation = pickOne([ 0, 90, 180, 270 ])
        // this.anchor = { x: 25, y: 25 }
        this.wallCollision = new Collision({ entity: this, blocks: "col-rects", rigid: true, movable: false, onHit: (block, movement) => {
            if (movement.y) {
                this.frictionX = 10
            }
        } })
        Movement.makeMovable(this, { accY: config.gravity })
    }
    update(dt) {
        Movement.update(this, dt)
        this.wallCollision.update()
        // Math.random() < 1/ 1000 && (
        //     console.log({ x: this.pos.x - this.prevPosX, y: this.pos.y - this.prevPosY})
        // )
    }
}

export default Crate