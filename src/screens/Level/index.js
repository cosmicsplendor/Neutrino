import { Camera, Node } from "@lib"
import Timer from "@utils/Timer"
import { easingFns } from "@utils/math"
import SoundSprite from "@utils/Sound/SoundSprite"
import { createAtlas } from "@lib/entities/TexRegion"
import TiledLevel from "@utils/TiledLevel"

import config from "@config"
import Player from "@entities/Player"
import Crate from "@entities/Crate"

import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"
import levelDataId from "@assets/levels/level.cson"
import texatlasId from "@assets/images/texatlas.png"
import texatlasMetaId from "@assets/images/atlasmeta.cson"


class LevelScreen extends Camera {
    background = "white"
    initialized = false
    constructor({ game }) {
        super({ id: "root", viewport: config.viewport })
        const { assetsCache } = game
        this.game = game
        this.addTimer = Timer.attachedTo(this)
        assetsCache.on("load", () => {
            const player = new Player({ width: 80, height: 80, fill: "brown", id: "player", speed: 100, pos: { x: 300 } })
            const crate = new Crate({ id: "crate", width: 50, height: 50, pos: { x: 200, y: 0 } })
            const texatlas = createAtlas({ 
                metaId: texatlasMetaId,
                imgId: texatlasId
            })
            const level = new TiledLevel({ 
                data: assetsCache.get(levelDataId),
                texatlas
            })

            level.pos.y = 100
            this.world =  { width: 1500, height: window.innerHeight }
            this.player = player
            this.setSubject(player)

            this.add(level)
            this.add(crate)
            this.add(player)

            this.addTimer({
                duration: 1,
                onDone: () => {  }
            })
        })  
    }
    onEnter() { 
        if (!this.initialized) {
            const { game } = this
            const meta = game.assetsCache.get(soundMetaId)
            const soundResource = game.assetsCache.get(soundSpriteId)
            const soundSprite = new SoundSprite({ resource: soundResource, resourceId: soundSpriteId, meta })
            this.soundSprite = soundSprite
            this.music = soundSprite.create("music", { volume: 0, pan: -1 })
            this.player.explosionSFX = soundSprite.createPool("explosion") 
            // this.music.play()
            this.initialized = true

            this.addTimer({
                duration: 10,
                onTick: progress => {
                    this.music.pan = easingFns.cubicIn(progress) - 1
                    this.music.volume = easingFns.cubicOut(progress) * 100
                }
            })
        }
    }
    onExit() {
        Node.cleanupRecursively(this)
        this.children.length = 0
    }
}

export default LevelScreen