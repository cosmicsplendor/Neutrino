import { Node } from "@lib"
import initUI from "./initUI"
import { MAIN_MENU } from "@screens/names"

class LoadingScreen extends Node {
    background = "#000000"
    constructor({ game, assets, uiRoot, sdk }) { 
        super()
        this.game = game
        this.assets = assets
        this.uiRoot = uiRoot
        this.sdk = sdk
    }
    onEnter() {
        const { assetsCache } = this.game

        assetsCache.load(this.assets)

        const { teardown, onProg, onError, onLoad } =  initUI(this.uiRoot)
        this.teardown = teardown
        this.onProg = onProg
        assetsCache.once("load", () => {
            onLoad()
            const switchToMainMenu = () => {
                this.game.switchScreen(MAIN_MENU)
            }
            this.sdk.signalLoad()
                .then(switchToMainMenu)
                .catch(switchToMainMenu)
        })
        assetsCache.on("prog", (val) => {
            onProg(val)
            this.sdk.setLoadProg(Math.round(val * 100))
        })
        assetsCache.once("error", onError)
    }
    onExit() {
        this.game.disposeScreen(this)
        this.teardown()
        this.game.assetsCache.off("prog", this.onProg)
        this.game.assetsCache.off("error")
    }
}

export default LoadingScreen