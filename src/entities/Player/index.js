import { Node } from "@lib"
import TexRegion from "@lib/entities/TexRegion"
import config from "@config"
import Collision from "@components/Collision"
import Movement from "@components/Movement"
import UI from "@utils/UI"
import { PlayerKeyControls, PlayerTouchControls } from "./PlayerControls"
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
            const el = UI.create("div")
            el.classList.add(styles.controlBtn)
            el.content = x.markup
            acc[x.name] = el
            return acc
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

class Player extends TexRegion {
    static sounds = [ "player_din", "concrete", "wood", "metal", "jump", "rolling", "player_exp" ]
    constructor({ speed = 48, width = 64, height = 64, fricX=4, shard, cinder, controls, sounds, ...rest }) {
        super({ frame: "ball", ...rest })
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
        this.sounds = sounds
        this.fricX0 = fricX

        this.shard.onDead = () => { // what should happen upon player explosion
            /**
             * implicit assumptions: 
             * 1. both cinder and shard should have same "lifetime"
             * 2. ParticleEmitters with finite "lifetime" (loop set to false) remove themselves from the parent once they're dead 
             */
            Node.get(curLevelId).resetRecursively() // this also sets player's alpha field to 1
        }
  
        this.controls = controls || new PlayerControlsClass(speed, getControlsMapping(), () => {
            sounds.jump.play()
        })
        this.wallCollision = new Collision({ entity: this, blocks: colRectsId, rigid: true, movable: false, onHit: this.onWallCol.bind(this) })
        this.spikeCollision = new Collision({ entity: this, blocks: "spikes", rigid: false, movable: false, onHit: this.explode.bind(this) })
        this.magnetCollision = new Collision({ entity: this, blocks: "magnets", rigid: true, movable: false, onHit: this.onMagnetCol.bind(this) })
        this.crateCollision = new Collision({ entity: this, blocks: "crates", rigid: true, movable: false, onHit: this.onCrateCol.bind(this) })
        // this.gateCollision = new Collision({ entity: this, blocks: "gates", rigid: false, movable: false, onHit: this.explode.bind(this) })
        
        Movement.makeMovable(this, { accY: config.gravity, roll: true, fricX })
        window.temp1 = sounds.jump
        sounds.rolling.speed = 1.2
    }
    onEndReached() {
        // play sound
        // fadeOut(this, 0.5, () => this.game.nextLevel())
    }
    get visible() {
        return this.alpha !== 0 && this._visible
    }
    set offEdge(which) {
        this.controls.switchState("offEdge", which)
        this._offEdge = which
    }
    get offEdge() {
        return this._offEdge
    }
    onFall() {
        this.controls.switchState("jumping", this, true)
    }
    testCol(entity) {

    }
    getCtrlBtns() {
        if (!config.isMobile) {
            throw new Error(`control buttons are not defined for non-touch/desktop devices`)
        }
        return this.controls.mappings
    }
    onWallCol(block, velX, velY, moved) {
        if (moved) { // hardcoding palyer collision audio threshold speed to 100
            const colSpeed = Math.abs(velY || velX) || 0
            if (colSpeed > 100) {
                this.sounds[block.mat || "concrete"].play(Math.min(1, colSpeed / 800)) // hardcoding palyer collision audio cutoff speed to 600
            }
        }
        if (velY) {
            if (velY > 0) {
                this.fricX = this.fricX0
                return this.controls.switchState("rolling")
            }
            // collision with the bottom edge
            if (this.controls.state && this.controls.state.name === "jumping") {
                this.controls.state.onHalt()
            }
        }
    }
    onMagnetCol(block, velX, velY, moved) {
        if (moved) { // hardcoding palyer collision audio threshold speed to 100
            const colSpeed = Math.abs(velY || velX) || 0
            if (colSpeed > 100) {
                this.sounds.metal.play(Math.min(1, colSpeed / 3000)) // hardcoding collision audio cutoff speed to 1200
            }
        }
        if (velY && velY < 0) {
            this.velY = -100
            if (this.controls.state.name === "jumping") {
                this.fricX = this.fricX0 * 2
                this.controls.state.onHalt()
            }
        }
    } 
    onCrateCol(block, velX, velY, moved) {
        if (velY) {
            block.takeDamage(velY)
            if (velY > 0) {
                this.fricX = this.fricX0
                return this.controls.switchState("rolling")
            }
            // collision with the bottom edge
            if (this.controls.state && this.controls.state.name === "jumping") {
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
        this.sounds.player_exp.play(0.6)
        this.sounds.player_din.play(0.2)
        this.velX = this.velY = 0
    }
    updateAudio() {
        if (this.controls.state.name !== "jumping" && this.pos.x !== this.prevPosX) {
            this.sounds.rolling.volume = Math.abs(this.pos.x - this.prevPosX) / 8
            this.sounds.rolling.play()
        } else {
            this.sounds.rolling.pause()
        }
    }
    update(dt) {
        this.controls.update(this, dt)
        Boolean(this.offEdge) ? Movement.updateOffEdge(this, dt): Movement.update(this, dt)
        this.wallCollision.update()
        this.magnetCollision.update()
        this.spikeCollision.update()
        this.crateCollision.update()
        this.updateAudio()
    }
    onRemove() {
        this.parent = null // free-up the reference for garbage collector
    }
}

export default Player