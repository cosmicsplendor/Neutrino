import { Camera } from "@lib"
import Timer from "@utils/Timer"
import { easingFns } from "@utils/math"
import SoundSprite from "@utils/Sound/SoundSprite"
import { createAtlas } from "@lib/entities/TexRegion"
import TiledLevel from "@utils/TiledLevel"
import Texture from "@lib/entities/Texture"

import config from "@config"
import Wall from "@entities/Wall"
import Player from "@entities/Player"
import Crate from "@entities/Crate"

import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"
import levelDataId from "@assets/levels/level.cson"
import texatlasId from "@assets/images/texatlas.png"
import texatlasMetaId from "@assets/images/atlasmeta.cson"


class LevelScreen extends Camera {
    background = "burlywood"
    initialized = false
    constructor({ game }) {
        super({ id: "root", viewport: config.viewport })
        const { assetsCache } = game
        this.game = game
        assetsCache.on("load", () => {
            const wall = new Wall({ crestId: "wall", blockWidth: 80, blockHeight: 80 })
            const player = new Player({ width: 80, height: 80, fill: "brown", id: "player", speed: 100, pos: { x: 300 } })
            const crate = new Crate({ id: "crate", width: 50, height: 50, pos: { x: 200, y: 0 } })
            const level = new TiledLevel({ 
                data: assetsCache.get(levelDataId),
                texatlas: createAtlas({ 
                    meta: assetsCache.get(texatlasMetaId),
                    texture: new Texture({ url: texatlasId })
                })
            })
            level.pos.y = 100
            this.world =  { width: wall.width, height: wall.height }
            this.player = player
            this.setSubject(player)

            this.add(level)
            this.add(crate)
            this.add(player)

            config.viewport.on("change", viewport => {
                this.viewport = viewport
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

            this.add(new Timer({
                duration: 10,
                onTick: progress => {
                    this.music.pan = easingFns.cubicIn(progress) - 1
                    this.music.volume = easingFns.cubicOut(progress) * 100
                }
            }))
        }
    }
    onExit() { }
}

export default LevelScreen