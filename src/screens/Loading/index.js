import { Node } from "@lib"
import { MAIN_MENU } from "@screens/names"

class LoadingScreen extends Node {
    background = "#000000"
    constructor({ game, assets }) { 
        super()
        this.game = game
        this.assets = assets
    }
    onEnter() {
        const { assetsCache } = this.game
        
        assetsCache.load(this.assets)

        assetsCache.once("error", console.log)
        assetsCache.once("load", () => {
            this.game.switchScreen(MAIN_MENU)
        })
    }
    onExit() {
        this.game.disposeScreen(this)
    }
}

export default LoadingScreen