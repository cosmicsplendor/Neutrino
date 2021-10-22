import { Node } from "@lib"
import { LEVEL } from "@screens/names"
import initUI from "./initUI"

class MainMenuScreen extends Node {
    background = "#000000"
    constructor({ game, uiRoot }) {
        super()
        this.game = game
        this.uiRoot = uiRoot
        // game.assetsCache.on("load", () => {
        //     this.logo = new TexRegion({ frame: "logo" })
        //     this.ball = new TexRegion({ frame: "ball" })
        //     this.ball.anchor = {
        //         x: this.ball.w / 2,
        //         y: this.ball.h / 2
        //     }
        //     this.ball.rotation = 0
        //     // this.add(this.logo)
        //     // this.add(this.ball)
        // })
    }
    onEnter() {
        const { uiRoot, game } = this
        this.teardownUI = initUI({ uiRoot, onPlay: () => {
            game.switchScreen(LEVEL, true)
        }})
    }
    onExit() {
        this.teardownUI()
    }
}

export default MainMenuScreen