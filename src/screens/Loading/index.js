import { skewedRand } from "@utils/math"
import { Node } from "@lib"
import { Rect } from "@lib/entities"
import { center } from "@utils/entity"
import Timer from "@utils/Timer"
import { easingFns } from "@utils/math"

import config from "@config"
import { MAIN_MENU } from "@screens/names"

import soundSprite from "@assets/audio/sprite.mp3"

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
        const startAnim = () => {
            this.add(new Timer({
                duration: 1 / 2,
                onTick: prog => {
                    this.pos.x = easingFns.cubicOut(prog) * 24 - 12
                },
                onDone: () => {
                    this.add(new Timer({
                        duration: 1 / 2,
                        onTick: prog => {
                            this.pos.x = 12 - easingFns.cubicOut(prog) * 24
                        },
                        onDone: () => {
                            startAnim()
                        }
                    }))
                }
            }))
        }
        startAnim()
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
            { url: soundSprite, msg: "Loading sound" }
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