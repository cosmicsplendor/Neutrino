import { Node } from "@lib"
import { webAudioSupported } from "@utils/Sound"
import ParallaxCamera from "@lib/entities/ParallaxCamera"
import SoundSprite from "@utils/Sound/SoundSprite"
import ParticleEmitter from "@lib/utils/ParticleEmitter"
import TexRegion from "@lib/entities/TexRegion"
import State from "./State"
import initUI from "./initUI"
import { LEVEL } from "../names"
import * as rendApis  from "@lib/renderer/apis"
import moonImg from "@assets/images/background.png"
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
import rvaImgId from "@assets/images/ui/rva.png" // rewarded video add icon
import { hexToNorm } from "@lib/utils/math"
import Checkpoint from "./Checkpoint"

class GameScreen extends Node { // can only have cameras as children
    // background = "rgb(181 24 24)"
    initialized = false
    soundPools = [ "gate" ]
    constructor({ game, uiRoot, storage, sdk }) {
        super()
        const { assetsCache } = game
        this.storage = storage
        this.sdk = sdk
        this.game = game
        this.uiRoot = uiRoot
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
            
            shard.onRemove = () => {
                shard.parent = null
            }
            cinder.onRemove = () => {
                cinder.parent = null
            }

            this.soundSprite = soundSprite
            this.btnSound = soundSprite.create("btn")
            this.errSound = soundSprite.createPool("err_alt")
            this.contSound = soundSprite.create("continue")
            this.music = {
                "music1": soundSprite.create("music1")
            }
            this.player = new Player({ width: 64, height: 64, fill: "brown", speed: 350, fricX: 3, pos: { x: 300, y: 0 }, shard, cinder, sounds: playerSounds, state: this.state })
            this.factories = makeFactories({ soundSprite, assetsCache, storage, player: this.player, state: this.state })
            if (game.renderer.api === rendApis.WEBGL && !config.isMobile) {
                const bgData = assetsCache.get(bgDataId)
                const dataToTile = tile => new TexRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }})
                this.bg = new ParallaxCamera({ z: 2.5, zAtop: 1, viewport: config.viewport, subject: this.player, instF: false, entYOffset: 0, tiles: bgData.map(dataToTile) }) // parallax bg
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
                rva: assetsCache.get(rvaImgId)
            }
        })
    }
    setLevel(data, music) {
        const level = new Level({ player: this.player, data, viewport: config.viewport, subject: this.player, factories: this.factories, music, gameState: this.state })
        this.add(level)
        this.game.renderer.changeBackground(config.isMobile || this.game.renderer.api === rendApis.CNV_2D ? data.mob_bg: data.bg, moonImg)
        this.game.renderer.canvas.style.backgroundPosition = data.bgPos ?? "-50%"
        this.game.renderer.gTint = data.tint && data.tint.split(",")
        level.parent = null // sever the child to parent link (necessary for correct collision detection when camera isn't the root node)
        if (this.bg) {
            this.bg.overlay = data.pxbg && hexToNorm(data.pxbg)
            this.bg.layoutTiles(level.world)
        }
        return level
    }
    unsetLevel() {
        if (this.children) {
            const lastIdx = this.children.length - 1
            lastIdx > -1 && Node.removeChild(this, this.children[lastIdx])
        }
    }
    onEnter(l) {
        const levelIdx = Math.min(l - 1, levels.length - 1)
        const levelDataId = levels[levelIdx].id
        const music = levels[levelIdx].music

        const data = Object.assign(this.game.assetsCache.get(levelDataId), levels[levelIdx])
        const level = this.setLevel(data, music && this.music[music])
        const onClose = advance => this.game.switchScreen(LEVEL, false, advance)
        const checkpoint = new Checkpoint(data.checkpoints)
        this.checkpoint = checkpoint
        const resetLevel = () => {
            window.Node = Node
            window.level = level
            level.resetRecursively()
            checkpoint.reset()
        }
        const focusInst = () => {
            level.focusInst()
            this.bg && this.bg.focusInst()
        }
        
        focusInst()
        level.idx = levelIdx
        const getCheckpoint = checkpoint.get.bind(checkpoint)
        const { teardownUI, updateTimer } = initUI(this.uiRoot, this.player, this.uiImages, this.storage, this.state, onClose, resetLevel, focusInst, getCheckpoint, this.btnSound, this.errSound, this.contSound, webAudioSupported, this.game, this.sdk)
        this.state.level = levelIdx + 1
        this.teardownUI = teardownUI
        this.updateTimer = updateTimer
        this.state.play()
    }
    onExit() {
        this.unsetLevel()
        this.teardownUI && this.teardownUI()
        this.game.reset()
        this.state.halt()
        this.state.elapsed = 0
    }
    update(dt, t) {
        this.checkpoint.updateX(this.player.pos.x)
        this.state.elapsed += dt
        this.children.forEach(child => {
            Node.updateRecursively(child, dt, t, child) // out-of-view culling on a per-camera basis
        })
        this.updateTimer(this.state.elapsed)
    }
}

export default GameScreen