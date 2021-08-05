import { Node } from "@lib"
import Texture from "@lib/entities/Texture"
import config from "@config"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import PlayerKeyControls from "./PlayerKeyControls"
import crateImgUrl from "@assets/images/carton.png"
import { colRectsId, curLevelId } from "@lib/constants"

class Player extends Texture {
    constructor({ speed = 48, width = 64, height = 64, fricX=4, shard, cinder, ...rest }) {
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
        this.shard = shard
        this.cinder = cinder
        
  
        this.keyControls = new PlayerKeyControls(speed)
        this.wallCollision = new Collision({ entity: this, blocks: colRectsId, rigid: true, movable: false, onHit: this.onWallCollision.bind(this) })
        this.spikeCollision = new Collision({ entity: this, blocks: "spikes", rigid: false, movable: false, onHit: this.explode.bind(this) })
        this.gateCollision = new Collision({ entity: this, blocks: "gates", rigid: false, movable: false, onHit: this.explode.bind(this) })
        
        Movement.makeMovable(this, { accY: config.gravity, roll: true, fricX })
    }
    set offEdge(which) {
        this.keyControls.switchState("offEdge", which)
        this._offEdge = which
    }
    get offEdge() {
        return this._offEdge
    }
    onWallCollision(block, movX, movY) {
        if (movY) {
            if (movY > 0) {
                return this.keyControls.switchState("rolling")
            }
            // collision with the bottom edge
            if (this.keyControls.state && this.keyControls.state.name && this.keyControls.state.name === "jumping") {
                // this.velY = -100
                this.keyControls.state.onHalt()
            }
        }
    } 
    explode() {
        this.cinder.pos.x = this.shard.pos.x = this.pos.x + this.width / 2
        this.cinder.pos.y = this.shard.pos.y = this.pos.y + this.height / 2
        this.remove()
        this.shard.onDone = () => { 
            // this.alpha = 1;
            // Node.get(curLevelId).resetRecursively()
         }
        Node.get(curLevelId).add(this.shard)
        Node.get(curLevelId).add(this.cinder)
    }
    update(dt) {
        this.keyControls.update(this, dt)
        Boolean(this.offEdge) ? Movement.updateOffEdge(this, dt): Movement.update(this, dt)
        this.wallCollision.update()
        this.spikeCollision.update()
        this.gateCollision.update()
    }
}

export default Player