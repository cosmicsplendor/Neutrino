import { Node } from "@lib"
import Texture from "@lib/entities/Texture"
import config from "@config"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import { PlayerKeyControls, PlayerTouchControls } from "./PlayerControls"
import crateImgUrl from "@assets/images/carton.png"
import { colRectsId, curLevelId, objLayerId } from "@lib/constants"
import styles from "./style.css"

const getTouchMappings = () => {
    const data = [
        { name: "left", markup: `<` },
        { name: "right", markup: `>` },
        { name: "axn", markup: `^` },
    ]
    return Object.freeze(
        data.reduce((acc, x) => {
            const el = document.createElement("div")
            el.classList.add(styles.controlBtn)
            el.innerHTML = x.markup
            acc[x.name] = el
        }, {})
    )
}

const getKeyMappings = () => Object.freeze({
    left: [ 37, 65 ],
    right: [ 39, 68 ],
    axn: 32
})

const PlayerControlsClass = config.isMobile ? PlayerTouchControls: PlayerKeyControls
const getControlsMapping = config.isMobile ? getTouchMappings: getKeyMappings

class Player extends Texture {
    constructor({ speed = 48, width = 64, height = 64, fricX=4, shard, cinder, controls, ...rest }) {
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

        this.shard.onDead = () => { // what should happen upon player explosion
            /**
             * implicit assumptions: 
             * 1. both cinder and shard should have same "lifetime"
             * 2. ParticleEmitters with finite "lifetime" (loop set to false) remove themselves from the parent once they're dead 
             */
            Node.get(curLevelId).resetRecursively() // this also sets player's alpha field to 1
        }
  
        this.controls = controls || new PlayerControlsClass(speed, getControlsMapping())
        this.wallCollision = new Collision({ entity: this, blocks: colRectsId, rigid: true, movable: false, onHit: this.onWallCollision.bind(this) })
        this.spikeCollision = new Collision({ entity: this, blocks: "spikes", rigid: false, movable: false, onHit: this.explode.bind(this) })
        this.gateCollision = new Collision({ entity: this, blocks: "gates", rigid: false, movable: false, onHit: this.explode.bind(this) })
        
        Movement.makeMovable(this, { accY: config.gravity, roll: true, fricX })
    }
    set offEdge(which) {
        this.controls.switchState("offEdge", which)
        this._offEdge = which
    }
    get offEdge() {
        return this._offEdge
    }
    getCtrlBtns() {
        if (!config.isMobile) {
            throw new Error(`control buttons are not defined for non-touch/desktop devices`)
        }
        return this.controls.mappings
    }
    onWallCollision(block, movX, movY) {
        if (movY) {
            if (movY > 0) {
                return this.controls.switchState("rolling")
            }
            // collision with the bottom edge
            if (this.controls.state && this.controls.state.name && this.controls.state.name === "jumping") {
                // this.velY = -100
                this.controls.state.onHalt()
            }
        }
    } 
    explode() {
        this.cinder.pos.x = this.shard.pos.x = this.pos.x + this.width / 2
        this.cinder.pos.y = this.shard.pos.y = this.pos.y + this.height / 2
        
        this.alpha = 0  // forces off the visibility (ensuring no update or rendering)
        Node.get(objLayerId).add(this.cinder) // particle emitters have to be manually inserted into the scene graph, since it doesn't implicitly know where it should be located
        Node.get(objLayerId).add(this.shard)
    }
    update(dt) {
        this.controls.update(this, dt)
        Boolean(this.offEdge) ? Movement.updateOffEdge(this, dt): Movement.update(this, dt)
        this.wallCollision.update()
        this.spikeCollision.update()
        this.gateCollision.update()
    }
}

export default Player