import { Node } from "@lib"
import ParallaxCamera from "@lib/entities/ParallaxCamera"
import Timer from "@utils/Timer"
import SoundSprite from "@utils/Sound/SoundSprite"
import ParticleEmitter from "@lib/utils/ParticleEmitter"
import TexRegion from "@lib/entities/TexRegion"
import State from "./State"
import initUI from "./initUI"

import config from "@config"
import levels from "@config/levels"
import Level from "./levels/Level"
import makeFactories from "./makeFactories"
import Player from "@entities/Player"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"
import shardDataUrl from "@assets/particles/shard.cson"
import cinderDataUrl from "@assets/particles/cinder.cson"
import texatlasId from "@assets/images/texatlas.png"
import atlasmetaId from "@assets/images/atlasmeta.cson"
import bgDataId from "@assets/levels/background.cson"

import resumeImgId from "@assets/images/ui/resume.png"
import pauseImgId from "@assets/images/ui/pause.png"
import crossImgId from "@assets/images/ui/cross.png"
import resetImgId from "@assets/images/ui/reset.png"
import orbImgId from "@assets/images/ui/orb.png"

class GameScreen extends Node { // can only have cameras as children
    // background = "rgb(181 24 24)"
    initialized = false
    soundPools = [ "gate" ]
    elapsed = 0
    constructor({ game, uiRoot, storage }) {
        super()
        const { assetsCache } = game
        this.storage = storage
        this.game = game
        this.uiRoot = uiRoot
        this.addTimer = Timer.attachedTo(this)
        this.state = new State()
        this.state.on("pause", () => {
            game.pause()
        })
        this.state.on("over", () => {
            game.pause()
        }) 
        this.state.on("play", () => {
            game.resume()
        })
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
            this.factories = makeFactories({ soundSprite, assetsCache, storage })
            this.player = new Player({ width: 64, height: 64, fill: "brown", speed: 350, fricX: 3, pos: { x: 300, y: 0 }, shard, cinder, sounds: playerSounds })
            if (!config.isMobile) {
                const bgData = assetsCache.get(bgDataId)
                const dataToTile = tile => new TexRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }})
                this.bg = new ParallaxCamera({ z: 2.5, zAtop: 1, viewport: config.viewport, subject: this.player, entYOffset: 0, tiles: bgData.map(dataToTile) }) // parallax bg
                // this.bg.overlay = [ 0.5, 0.1, 0.1 ]
                this.add(this.bg)
            }
            this.uiImages = {
                cross: assetsCache.get(crossImgId),
                resume: assetsCache.get(resumeImgId),
                pause: assetsCache.get(pauseImgId),
                orb: assetsCache.get(orbImgId),
                reset: assetsCache.get(resetImgId)
            }
        })
    }
    setLevel(levelDataId) {
        const data = this.game.assetsCache.get(levelDataId)
        const level = new Level({ player: this.player, data, viewport: config.viewport, subject: this.player, factories: this.factories })
        this.add(level)
        this.game.renderer.changeBackground(config.isMobile ? data.mob_bg: data.bg)
        this.game.renderer.gTint = data.tint && data.tint.split(",")
        level.parent = null // sever the child to parent link
        if (this.bg) {
            this.bg.overlay = data.pxbg && data.pxbg.split(",").map(s => Number(s.trim()))
            this.bg.layoutTiles(level.world)
        }
    }
    unsetLevel() {
        if (this.children) {
            const idx = this.children.length - 1
            idx > -1 && Node.removeChild(this, this.children[idx])
        }
    }
    onEnter(curLevel) {
        const levelDataId = levels[curLevel - 1].id
        const { teardownUI, updateTimer } = initUI(this.uiRoot, config.mobile && this.player.getCtrlBtns(), this.uiImages, this.storage, this.state )

        this.setLevel(levelDataId)
        this.teardownUI = teardownUI
        this.updateTimer = updateTimer
        this.state.play()
    }
    onExit() {
        this.unsetLevel()
        this.teardownUI && this.teardownUI()
        this.game.reset()
        this.state.reset()
        this.elapsed = 0
    }
    update(dt, t) {
        this.elapsed += dt
        this.children.forEach(child => {
            Node.updateRecursively(child, dt, t, child) // out-of-view culling on a per-camera basis
        })
        this.updateTimer(this.elapsed)
    }
}

export default GameScreen