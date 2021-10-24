import { Node } from "@lib"
import { LEVEL } from "@screens/names"
import Title from "./Title"
import initUI from "./initUI"

class MainMenuScreen extends Node {
    background = "#000000"
    constructor({ game, uiRoot }) {
        super()
        this.game = game
        this.uiRoot = uiRoot
        this.pos.x = 400
        this.pos.y = 100
        game.assetsCache.on("load", () => {
            this.add(new Title())
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
    }
}

export default MainMenuScreen