import Rect from "@lib/entities/Rect"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import config from "@config"

class Crate extends Rect {
    constructor({ groupID, wallID, playerID, ...rectProps }) {
        super({ ...rectProps })
        this.mutualCollision = new Collision({ entity: this, blocks: groupID, static: true, mutual: true })
        this.wallCollision = new Collision({ entity: this, blocks: wallID, static: true })
        this.playerCollision = new Collision({ entity: this, block: playerID, static: true })
        this.vel = { x: 0, y: 0 }
        this.acc = { x: 0, y: config.gravity }
    }
    update(dt) {    
        Movement.update(this, dt)
        this.mutualCollision.update(this, dt)
        this.wallCollision.update(this, dt)
    }
}

export default Crate