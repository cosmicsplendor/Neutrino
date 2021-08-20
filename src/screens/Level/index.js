import { Node } from "@lib"
import ParallaxCamera from "@lib/entities/ParallaxCamera"
import Timer from "@utils/Timer"
import SoundSprite from "@utils/Sound/SoundSprite"
import ParticleEmitter from "@lib/utils/ParticleEmitter"

import config from "@config"
import Level1 from "./levels/Level1"
import makeFactories from "./makeFactories"
import Player from "@entities/Player"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"
import shardDataUrl from "@assets/particles/shard.cson"
import cinderDataUrl from "@assets/particles/cinder.cson"
import texatlasId from "@assets/images/texatlas.png"
import atlasmetaId from "@assets/images/atlasmeta.cson"

class LevelScreen extends Node { // can only have cameras as children
    background = config.isMobile ? "#000000" : "#2e2e3d"
    // background = "#313143"
    initialized = false
    soundPools = [ "gate" ]
    constructor({ game, uiRoot }) {
        super()
        const { assetsCache } = game
        this.game = game
        this.uiRoot = uiRoot
        this.addTimer = Timer.attachedTo(this)
        assetsCache.on("load", () => {
            const meta = assetsCache.get(soundMetaId)
            const soundResource = assetsCache.get(soundSpriteId)
            const soundSprite = new SoundSprite({ resource: soundResource, resourceId: soundSpriteId, meta })
            const shard = new ParticleEmitter(Object.assign(assetsCache.get(shardDataUrl), { metaId: atlasmetaId, imgId: texatlasId}))
            const cinder = new ParticleEmitter(Object.assign(assetsCache.get(cinderDataUrl), { metaId: atlasmetaId, imgId: texatlasId}))
            const playerSounds = Player.sounds.reduce((spritemap, frame) => {
                spritemap[frame] = soundSprite.create(frame)
                return spritemap
            }, {})
            this.bgMusic = soundSprite.create("music1")
            
            this.soundSprite = soundSprite
            this.factories = makeFactories({ soundSprite, assetsCache })
            this.player = new Player({ width: 64, height: 64, fill: "brown", speed: 350, fricX: 3, pos: { x: 300, y: 0 }, shard, cinder, sounds: playerSounds })
            this.bg = new ParallaxCamera({ z: 2.5, zAtop: 1, viewport: config.viewport, subject: this.player, entYOffset: 0 }) // parallax bg
            this.fbg = new ParallaxCamera({ z: 5, zAtop: 1, viewport: config.viewport, subject: this.player, entYOffset: -80 })// parallax far-background
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
        const startingLevel = new Level1({ player: this.player, uiRoot: this.uiRoot, assetsCache: this.game.assetsCache, viewport: config.viewport, bg: this.bg, fbg: this.fbg, subject: this.player, factories: this.factories })
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