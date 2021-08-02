import TexRegion from "@lib/entities/TexRegion"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import config from "@config"

class Crate extends TexRegion {
    constructor(props) {
        super(props)
        this.smooth = true
        this.wallCollision = new Collision({ entity: this, blocks: "col-rects", rigid: true, movable: false, onHit: this.onWallCollision })
        Movement.makeMovable(this, { accY: config.gravity, fricX: 3 })
    }
    onWallCollision() { }
    update(dt) {
        Movement.update(this, dt)
        this.wallCollision.update()
    }
}

export default Crate