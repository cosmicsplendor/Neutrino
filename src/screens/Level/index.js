import { Camera } from "@lib"
import Timer from "@utils/Timer"
import { easingFns } from "@utils/math"

import config from "@config"
import Wall from "@entities/Wall"
import Player from "@entities/Player"
import Crate from "@entities/Crate"

class LevelScreen extends Camera {
    background = "black"
    initialized = false
    constructor({ game }) {
        super({ id: "root", viewport: config.viewport })
        game.assetsCache.on("load", () => {
            const wall = new Wall({ crestID: "wall", blockWidth: 80, blockHeight: 80 })
            const player = new Player({ width: 80, height: 80, fill: "brown", id: "player", speed: 100, pos: { x: 2050 } })
            const crate = new Crate({ id: "crate", width: 50, height: 50, pos: { x: 2000, y: 0 } })

            this.world =  { width: wall.width, height: wall.height }
            this.player = player
            this.game = game
            this.setSubject(player)

            this.add(wall)
            this.add(crate)
            this.add(player)

            config.viewport.on("change", viewport => {
                this.viewport = viewport
            })
        })

    }
    onEnter(soundAtlas) { 
        if (!this.initialized) {
            this.soundAtlas = soundAtlas
            this.music = soundAtlas.create("music", { volume: 0, pan: -1 })
            this.player.explosionSFX = soundAtlas.createPool("explosion") 
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