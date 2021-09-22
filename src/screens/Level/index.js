import { Node } from "@lib"
import ParallaxCamera from "@lib/entities/ParallaxCamera"
import Timer from "@utils/Timer"
import SoundSprite from "@utils/Sound/SoundSprite"
import ParticleEmitter from "@lib/utils/ParticleEmitter"
import TexRegion from "@lib/entities/TexRegion"

import config from "@config"
import Level1 from "./levels/Level1"
import levelDataId from "@assets/levels/level.cson"
import makeFactories from "./makeFactories"
import Player from "@entities/Player"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"
import shardDataUrl from "@assets/particles/shard.cson"
import cinderDataUrl from "@assets/particles/cinder.cson"
import texatlasId from "@assets/images/texatlas.png"
import atlasmetaId from "@assets/images/atlasmeta.cson"
import bgDataId from "@assets/levels/background.cson"

class LevelScreen extends Node { // can only have cameras as children
    // background = "rgb(181 24 24)"
    background = "#313143"
    initialized = false
    soundPools = [ "gate" ]
    constructor({ game, uiRoot }) {
        super()
        const { assetsCache } = game
        this.game = game
        this.uiRoot = uiRoot
        this.addTimer = Timer.attachedTo(this)
        assetsCache.once("load", () => {
            const meta = assetsCache.get(soundMetaId)
            const soundResource = assetsCache.get(soundSpriteId)
            const soundSprite = new SoundSprite({ resource: soundResource, resourceId: soundSpriteId, meta })
            const shard = new ParticleEmitter(Object.assign(assetsCache.get(shardDataUrl), { metaId: atlasmetaId, imgId: texatlasId}))
            const cinder = new ParticleEmitter(Object.assign(assetsCache.get(cinderDataUrl), { metaId: atlasmetaId, imgId: texatlasId}))
            const playerSounds = Player.sounds.reduce((spritemap, frame) => {
                spritemap[frame] = soundSprite.create(frame)
                return spritemap
            }, {})
            
            this.soundSprite = soundSprite
            this.factories = makeFactories({ soundSprite, assetsCache })
            this.player = new Player({ width: 64, height: 64, fill: "brown", speed: 350, fricX: 3, pos: { x: 300, y: 0 }, shard, cinder, sounds: playerSounds })
            if (!config.isMobile) {
                const bgData = assetsCache.get(bgDataId)
                const dataToTile = tile => new TexRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }})
                this.bg = new ParallaxCamera({ z: 2.5, zAtop: 1, viewport: config.viewport, subject: this.player, entYOffset: 0, tiles: bgData.map(dataToTile) }) // parallax bg
                // this.bg.overlay = [ 0.5, 0.1, 0.1 ]
                this.add(this.bg)
            }
        })
    }
    setLevel(levelDataId) {
        const data = this.game.assetsCache.get(levelDataId)
        const level = new Level1({ player: this.player, uiRoot: this.uiRoot, data, viewport: config.viewport, subject: this.player, factories: this.factories })
        this.add(level)
        // this.game.renderer.gTint = [ 0.05, 0, -0.05, 0 ]
        this.bg && this.bg.layoutTiles(level.world)
        this.fbg && this.fbg.layoutTiles(level.world)
        level.parent = null // sever the child to parent link
    }
    unsetLevel() {
        if (this.children) {
            const idx = this.children.length - 1
            idx > -1 && Node.removeChild(this, this.children[idx])
        }
    }
    onEnter() { 
        this.setLevel(levelDataId)
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