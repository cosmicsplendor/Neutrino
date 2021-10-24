import { Node } from "@lib"
import config from "@config"
import { calcAligned, getGlobalPos } from "@utils/entity"
import { LEVEL } from "@screens/names"
import Title from "./Title"
import initUI from "./initUI"

class MainMenuScreen extends Node {
    background = "#000000"
    constructor({ game, uiRoot }) {
        super()
        this.game = game
        this.uiRoot = uiRoot
        game.assetsCache.on("load", () => {
            const { viewport } = config
            this.gameTitle = new Title()
            this.realign = vp => {
                const { devicePixelRatio } = config
                this.gameTitle.pos = { ...calcAligned({
                    x: 0, y:0, width: vp.width * devicePixelRatio, height: vp.height * devicePixelRatio
                }, { width: this.gameTitle.width, height: this.gameTitle.height }, "center", "top", 15, 100) }
            }
            viewport.on("change", this.realign)
            this.realign(viewport)
            this.add(this.gameTitle)
        })
    }
    onEnter() {
        const { uiRoot, game } = this
        this.teardownUI = initUI({ uiRoot, onPlay: () => {
            game.switchScreen(LEVEL, true)
        }})
    }
    onExit() {
        this.teardownUI()
        config.viewport.off("change", this.realign)
    }
}

export default MainMenuScreen