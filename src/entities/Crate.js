import Rect from "@lib/entities/Rect"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import config from "@config"

class Crate extends Rect {
    constructor(...rectProps) {
        super(...rectProps)
        this.fill = "lemonchiffon"
        this.stroke = "orange"
        this.debug = true
        this.wallCollision = new Collision({ entity: this, blocks: "wall", resolve: true, onHit: (block, movement) => {
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