import { Node } from "@lib"
import initUI from "./initUI"
import { MAIN_MENU } from "@screens/names"

class LoadingScreen extends Node {
    background = "#000000"
    constructor({ game, assets, uiRoot }) { 
        super()
        this.game = game
        this.assets = assets
        this.uiRoot = uiRoot
    }
    onEnter() {
        const { assetsCache } = this.game

        assetsCache.load(this.assets)

        const { teardown, onProg, onError } =  initUI(this.uiRoot)
        this.teardown = teardown
        this.onProg = onProg
        assetsCache.once("load", () => {
            this.game.switchScreen(MAIN_MENU)
        })
        assetsCache.on("prog", onProg)
        assetsCache.once("error", onError)
    }
    onExit() {
        this.game.disposeScreen(this)
        this.teardown()
        this.game.assetsCache.off("prog", this.onProg)
    }
}

export default LoadingScreen