import { Node } from "@lib"
import { Rect } from "@lib/entities"
import { calcCentered } from "@utils/entity"

import config from "@config"
import { MAIN_MENU } from "@screens/names"

import soundSprite from "@assets/audio/sprite.mp3"
import soundSpriteMeta from "@assets/audio/sprite.cson"
import cartonImg from "@assets/images/carton.png"
import cartonDarkImg from "@assets/images/cartonDark.png"
import texatlasImg from "@assets/images/texatlas.png"
import texatlasMeta from "@assets/images/atlasmeta.cson"
import levelDataUrl from "@assets/levels/level.cson"
import fireDataId from "@assets/particles/fire.cson"
import shardDataId from "@assets/particles/shard.cson"
import cinderDataId from "@assets/particles/cinder.cson"

class TitleScreen extends Node {
    background = "black"
    constructor({ game }) { 
        super()
        this.game = game
        const progressOutline = new Rect({ width: 250, height: 40, fill: "rgba(0, 0, 0, 0)", stroke: "whitesmoke", strokeWidth: 2 })
        const progressBar = new Rect({ width: 0, height: 40, fill: "whitesmoke" })
        this.progressBar = progressBar
        this.realign = viewport => { 
            progressBar.pos = progressOutline.pos = calcCentered(viewport, { width: 250, height: 40 })
        }
        this.add(progressBar)
        this.add(progressOutline)
        this.realign(config.viewport)
    }
    onEnter() {
        const { assetsCache } = this.game
        
        assetsCache.load([
            { url: soundSprite, msg: "loading audio sprite" },
            { url: soundSpriteMeta, msg: "loading audio sprite metadata"},
            { url: cartonImg, msg: "loading Images" },
            { url: cartonDarkImg },
            { url: texatlasImg },
            { url: texatlasMeta, msg: "loading texture atlas" },
            { url: levelDataUrl, msg: "loading level data" },
            { url: fireDataId, msg: "loading particles" },
            { url: cinderDataId },
            { url: shardDataId }
        ])

        assetsCache.on("error", console.log)
            assetsCache.on("progress", progress => {
            this.progressBar.width = progress * 250
        })
        assetsCache.on("progress", payload => {
            this.progressBar.width = 250 * payload.progress
        })
        assetsCache.on("load", () => {
            this.game.switchScreen(MAIN_MENU)
        })
        config.viewport.on("change", this.realign)
    }
    onExit() {
        config.viewport.off("change", this.realign)
        this.game.disposeScreen(this)
    }
}

export default TitleScreen