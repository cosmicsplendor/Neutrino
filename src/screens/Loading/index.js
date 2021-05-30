import { skewedRand } from "@utils/math"
import { Node } from "@lib"
import { Rect } from "@lib/entities"
import { center } from "@utils/entity"

import config from "@config"
import bgMusicUrl from "@assets/audio/music2.wav"
import { MAIN_MENU } from "@screens/names"

class TitleScreen extends Node {
    background = "black"
    constructor({ game }) { 
        super()
        this.game = game
        const progressOutline = new Rect({ width: 250, height: 40, fill: "rgba(0, 0, 0, 0)", stroke: "whitesmoke", strokeWidth: 2 })
        const progressBar = new Rect({ width: 0, height: 40, fill: "whitesmoke" })
        this.progressBar = progressBar
        this.realign = viewport => { 
            progressBar.pos = progressOutline.pos = center(viewport, { width: 250, height: 40 })
        }
        
        this.add(progressBar)
        this.add(progressOutline)
        this.realign(config.viewport)

    }
    update(dt) {
        this.progressBar.width = Math.min(this.progressBar.width + dt * skewedRand(500), 250)
        if (this.progressBar.width === 250) {
            this.game.switchScreen(MAIN_MENU)
        }
    }
    onEnter() {
        const { assetsCache } = this.game
        
        assetsCache.load([
            { url: bgMusicUrl, msg: "Loading sound" }
        ])

        assetsCache.once("load", () => { })

        assetsCache.on("error", console.log)

        assetsCache.on("progress", ({ progress, msg }) => {
            console.log(`Loading progress: ${progress}%`)
            console.log(`Loading message: ${msg}`)
        })

        config.viewport.on("change", this.realign)
    }
    onExit() {
        config.viewport.off("change", this.realign)
    }
}

export default TitleScreen