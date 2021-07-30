import { Node } from "@lib"
import ParallaxCamera from "@lib/entities/ParallaxCamera"
import Timer from "@utils/Timer"
import SoundSprite from "@utils/Sound/SoundSprite"

import config from "@config"
import Level1 from "./levels/Level1"
import Player from "@entities/Player"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"

class LevelScreen extends Node { // can only have cameras as children
    background = "#2e2e3d"
    initialized = false
    constructor({ game }) {
        super()
        const { assetsCache } = game
        this.game = game
        this.addTimer = Timer.attachedTo(this)
        assetsCache.on("load", () => {
            const meta = assetsCache.get(soundMetaId)
            const soundResource = assetsCache.get(soundSpriteId)
            const soundSprite = new SoundSprite({ resource: soundResource, resourceId: soundSpriteId, meta })
            
            this.soundSprite = soundSprite
            this.music = soundSprite.create("music", { volume: 1, pan: -1 })
            this.explosionSound = soundSprite.createPool("explosion") 
            // this.music.play()
            this.player = new Player({ width: 64, height: 64, fill: "brown", id: "player", speed: 450, fricX: 3, pos: { x: 300, y: 0 }})
            this.bg = new ParallaxCamera({ z: 3, zAtop: 1, viewport: config.viewport, subject: this.player, entYOffset: 0 }) // parallax bg
            this.fbg = new ParallaxCamera({ z: 4, zAtop: 3, viewport: config.viewport, subject: this.player, entYOffset: -170 })// parallax far-background
            this.add(this.fbg)
            this.add(this.bg)
        })
    }
    setLevel(level) {
        this.add(level)
        level.parent = null // sever the child to parent link
    }
    unsetLevel() {
        this.bg.children = []
        this.fbg.children = []
        if (this.children && this.children[2]) {
            Node.cleanupRecursively(this.children[2])
            Node.removeChild(this, this.children[2])
        }
    }
    onEnter() { 
        this.unsetLevel()
        const startingLevel = new Level1({ player: this.player, assetsCache: this.game.assetsCache, viewport: config.viewport, bg: this.bg, fbg: this.fbg, subject: this.player })
        this.setLevel(startingLevel)
    }
    onExit() {
        this.unsetLevel()
    }
    update(dt, t) {
        this.children.forEach(child => {
            Node.updateRecursively(child, dt, t, child) // out-of-view culling on a per-camera basis
        })
    }
}

export default LevelScreen