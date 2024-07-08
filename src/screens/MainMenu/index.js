import { Node } from "@lib"
import config from "@config"
import { calcAligned, getGlobalPos } from "@utils/entity"
import { LEVEL } from "@screens/names"
import Title from "./Title"
import initUI from "./initUI"

class MainMenuScreen extends Node {
    background = "#041a27"
    constructor({ game, uiRoot, sdk }) {
        super()
        this.game = game
        this.uiRoot = uiRoot
        this.sdk = sdk
        game.assetsCache.once("load", () => {
            const { viewport } = config
            this.gameTitle = new Title()
            this.realign = vp => {
                const { devicePixelRatio } = config
                this.gameTitle.pos = { ...calcAligned({
                    x: 0, y:0, width: vp.width * devicePixelRatio, height: vp.height * devicePixelRatio
                }, { width: this.gameTitle.width, height: this.gameTitle.height }, "center", "top", 15, 80) }
            }
            viewport.on("change", this.realign)
            this.realign(viewport)
            this.add(this.gameTitle)
        })
    }
    onEnter() {
        const { uiRoot, game, sdk } = this
        this.teardownUI = initUI({ uiRoot, onPlay: () => {
            // on play button click
            const proceed = () => game.switchScreen(LEVEL, true)
            uiRoot.clear()
            if (!config.prerollAd) {
                return proceed()
            }
            sdk.prerollAd()
                .then(proceed)
                .catch(proceed)
        }})
    }
    onExit() {
        this.teardownUI()
        config.viewport.off("change", this.realign)
    }
}

export default MainMenuScreen