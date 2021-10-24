import { Node } from "@lib"
import { supported as WebAudioSupported } from "@utils/Sound/APIs/WebAudio"
import ParallaxCamera from "@lib/entities/ParallaxCamera"
import Timer from "@utils/Timer"
import SoundSprite from "@utils/Sound/SoundSprite"
import ParticleEmitter from "@lib/utils/ParticleEmitter"
import TexRegion from "@lib/entities/TexRegion"
import State from "./State"
import initUI from "./initUI"
import { LEVEL } from "../names"
import * as rendApis  from "@lib/renderer/apis"

import config from "@config"
import levels from "@config/levels"
import Level from "./Level"
import makeFactories from "./makeFactories"
import Player from "@entities/Player"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"
import particlesUrl from "@assets/particles/all.cson"
import bgDataId from "@assets/levels/background.cson"

import resumeImgId from "@assets/images/ui/resume.png"
import pauseImgId from "@assets/images/ui/pause.png"
import crossImgId from "@assets/images/ui/cross.png"
import resetImgId from "@assets/images/ui/reset.png"
import orbImgId from "@assets/images/ui/orb.png"
import soundOnImgId from "@assets/images/ui/sound_on.png"
import soundOffImgId from "@assets/images/ui/sound_off.png"

class GameScreen extends Node { // can only have cameras as children
    // background = "rgb(181 24 24)"
    initialized = false
    soundPools = [ "gate" ]
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
        this.state.on("play", () => {
            game.resume()
        })
        storage.on("sound-update", state => {
            state ? game.turnOnSound(): game.turnOffSound()
        })
        assetsCache.once("load", () => {
            const soundSprite = new SoundSprite({ 
                resource: assetsCache.get(soundSpriteId), 
                resourceId: soundSpriteId, 
                meta: assetsCache.get(soundMetaId)
            })
            const particles = assetsCache.get(particlesUrl)
            const shard = new ParticleEmitter(particles.shard)
            const cinder = new ParticleEmitter(particles.cinder)
            const playerSounds = Player.sounds.reduce((spritemap, frame) => {
                spritemap[frame] = soundSprite.create(frame)
                return spritemap
            }, {})
            
            this.soundSprite = soundSprite
            this.btnSound = soundSprite.create("btn")
            this.errSound = soundSprite.createPool("err_alt")
            this.contSound = soundSprite.create("continue")
            this.music = [ "music1", "music2", "music3", "music4" ].reduce((acc, m) => {
                acc[m] = soundSprite.create(m)
                return acc
            }, {})
            this.player = new Player({ width: 64, height: 64, fill: "brown", speed: 350, fricX: 3, pos: { x: 300, y: 0 }, shard, cinder, sounds: playerSounds, state: this.state })
            this.factories = makeFactories({ soundSprite, assetsCache, storage, player: this.player, state: this.state })
            if (game.renderer.api === rendApis.WEBGL && !config.isMobile) {
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
                reset: assetsCache.get(resetImgId),
                soundOn: assetsCache.get(soundOnImgId),
                soundOff: assetsCache.get(soundOffImgId),
            }
        })
    }
    setLevel(data, music) {
        const level = new Level({ player: this.player, data, viewport: config.viewport, subject: this.player, factories: this.factories, music })
        this.add(level)
        this.game.renderer.changeBackground(config.isMobile || this.game.renderer.api === rendApis.CNV_2D ? data.mob_bg: data.bg)
        this.game.renderer.gTint = data.tint && data.tint.split(",")
        level.parent = null // sever the child to parent link
        if (this.bg) {
            this.bg.overlay = data.pxbg && data.pxbg.split(",").map(s => Number(s.trim()))
            this.bg.layoutTiles(level.world)
        }
        return level
    }
    unsetLevel() {
        if (this.children) {
            const idx = this.children.length - 1
            idx > -1 && Node.removeChild(this, this.children[idx])
        }
    }
    onEnter(l) {
        const levelDataId = levels[l - 1].id
        const music = levels[l - 1].music
        const data = this.game.assetsCache.get(levelDataId)
        const level = this.setLevel(data, music && this.music[music])
        const onClose = advance => this.game.switchScreen(LEVEL, false, advance)
        const resetLevel = () => {
            level.resetRecursively()
        }
        const focusInst = () => {
            level.focusInst()
            this.bg && this.bg.focusInst()
        }
        
        focusInst()
        data.checkpoints && data.checkpoints.sort((a, b) => b.x - a.x) // sorting in ascending order of x-coordinates
        const getCheckpoint = x => { // restore to checkpoint
            if (!data.checkpoints) return
            let checkpoint
            for (let point of data.checkpoints) {
                if (x < point.x) continue
                checkpoint = point
                break
            }
            return checkpoint
        }
        const { teardownUI, updateTimer } = initUI(this.uiRoot, this.player, this.uiImages, this.storage, this.state, onClose, resetLevel, focusInst, getCheckpoint, this.btnSound, this.errSound, this.contSound, WebAudioSupported)
        this.state.level = l
        this.teardownUI = teardownUI
        this.updateTimer = updateTimer
        this.state.play()
    }
    onExit() {
        this.unsetLevel()
        this.teardownUI && this.teardownUI()
        this.game.reset()
        this.state.reset()
        this.state.elapsed = 0
    }
    update(dt, t) {
        this.state.elapsed += dt
        this.children.forEach(child => {
            Node.updateRecursively(child, dt, t, child) // out-of-view culling on a per-camera basis
        })
        this.updateTimer(this.state.elapsed)
    }
}

export default GameScreen