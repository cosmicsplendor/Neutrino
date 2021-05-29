import { skewedRand } from "@utils/math"
import { Node } from "@lib"
import { Rect } from "@lib/entities"
import config from "@config"
import { center } from "@utils/entity"

import bgMusicUrl from "@assets/audio/music2.wav"

class TitleScreen extends Node {
    background = "black"
    constructor({ game }) { 
        super()
        const { assetsCache } = game
        const progressOutline = new Rect({ width: 250, height: 40, fill: "rgba(0, 0, 0, 0)", stroke: "red", strokeWidth: 2 })
        const progressBar = new Rect({ width: 0, height: 40, fill: "darkslateblue" })
        this.progressBar = progressBar
        this.realign = (viewport) => { 
            progressBar.pos = progressOutline.pos = center(viewport, { width: 250, height: 40 })
        }
        
        this.add(progressBar)
        this.add(progressOutline)
        this.realign(config.viewport)
        
        config.viewport.on("change", this.realign)
        
        assetsCache.load([
            { url: bgMusicUrl, msg: "Loading sound" }
        ])

        assetsCache.once("load", () => { })

        assetsCache.on("error", e => console.log)

        assetsCache.on("progress", ({ progress, msg }) => {
            console.log(`Loading progress: ${progress}%`)
            console.log(`Loading message: ${msg}`)
        })
    }
    update(dt) {
        this.progressBar.width = Math.min(this.progressBar.width + dt * skewedRand(200), 250)
        if (this.progressBar.width === 250) {

        }
    }
    onEnter() { }
    onExit() {
        config.viewport.off("change", this.realign)
    }
}

export default TitleScreen