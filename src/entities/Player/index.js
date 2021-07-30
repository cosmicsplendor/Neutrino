import Texture from "@lib/entities/Texture"
import config from "@config"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import PlayerKeyControls from "./PlayerKeyControls"
import crateImgUrl from "@assets/images/carton.png"
import { COL_RECTS } from "@lib/constants"


class Player extends Texture {
    constructor({ speed = 48, width = 64, height = 64, fricX=4, ...rest }) {
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
        this.wallCollision = new Collision({ entity: this, blocks: COL_RECTS, rigid: true, movable: false, onHit: this.onWallCollision })
        
        this.crateCollision = new Collision({ entity: this, block: "crate", rigid: true, onHit: this.onCrateCollision })
        
        Movement.makeMovable(this, { accY: config.gravity, roll: true, fricX })
    }
    set offEdge(val) {
        this.keyControls.switchState("offEdge", val)
        this._offEdge = val
    }
    get offEdge() {
        return this._offEdge
    }
    onWallCollision(block, movX, movY) {
        if (movY) {
            if (movY > 0) {
                this.keyControls.switchState("rolling")
            }
        }
    } 
    onCrateCollision(block, movX, movY) {
        if (movX) {
            // block.velX += sign(movX)
        }
        if (movY) {
            if (movY > 0) {
                this.keyControls.switchState("rolling")
            }
        }
    }
    update(dt) {
        this.keyControls.update(this, dt)
        Boolean(this.offEdge) ? Movement.updateOffEdge(this, dt): Movement.update(this, dt)
        this.crateCollision.update()
        this.wallCollision.update()
    }
}

export default Player