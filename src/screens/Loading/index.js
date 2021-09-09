import { Node } from "@lib"
import { MAIN_MENU } from "@screens/names"

class TitleScreen extends Node {
    background = "black"
    constructor({ game, assets }) { 
        super()
        this.game = game
        this.assets = assets
        // const progressOutline = new Rect({ width: 250, height: 40, fill: "rgba(0, 0, 0, 0)", stroke: "whitesmoke", strokeWidth: 2 })
        // const progressBar = new Rect({ width: 0, height: 40, fill: "whitesmoke" })
        // this.progressBar = progressBar
        // this.realign = viewport => { 
        //     progressBar.pos = progressOutline.pos = calcCentered(viewport, { width: 250, height: 40 })
        // }
        // this.add(progressBar)
        // this.add(progressOutline)
        // this.realign(config.viewport)
    }
    onEnter() {
        const { assetsCache } = this.game
        
        assetsCache.load(this.assets)

        assetsCache.once("error", console.log)
        // assetsCache.on("progress", payload => {
        //     this.progressBar.width = 250 * payload.progress
        // })
        assetsCache.once("load", () => {
            this.game.switchScreen(MAIN_MENU)
        })
        // config.viewport.on("change", this.realign)
    }
    onExit() {
        // config.viewport.off("change", this.realign)
        this.game.disposeScreen(this)
    }
}

export default TitleScreen