import { Camera } from "@lib"

import config from "@config"
import Wall from "@entities/Wall"
import Player from "@entities/Player"
import Crate from "@entities/Crate"

class LevelScreen extends Camera {
    background = "black"
    initialized = false
    constructor(game) {
        const wall = new Wall({ crestID: "wall", blockWidth: 50, blockHeight: 50 })
        const player = new Player({ width: 24, height: 24, fill: "brown", id: "player", speed: 100, pos: { x: 2050 } })
        const crate = new Crate({ id: "crate", width: 50, height: 50, pos: { x: 2000, y: 0 } })

        super({ id: "root", viewport: config.viewport, world: { width: wall.width, height: wall.height } })
        this.player = player
        this.game = game
        this.setSubject(player)

        this.add(wall)
        this.add(crate)
        this.add(player)

        config.viewport.on("change", viewport => {
            this.viewport = viewport
        })

    }
    onEnter(soundAtlas) { 
        if (!this.initialized) {
            this.soundAtlas = soundAtlas
            this.music = soundAtlas.createPool("music")
            this.player.explosionSFX = soundAtlas.createPool("explosion") 
            this.music.play()
            this.initialized = true
        }
    }
    onExit() { }
}

export default LevelScreen