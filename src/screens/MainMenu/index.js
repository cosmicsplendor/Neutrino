import { Node } from "@lib"
import initUI from "./initUI"
import { GAME } from "@screens/names"

class MainMenuScreen extends Node {
    background = "black"
    constructor({ game, uiRoot }) {
        super()
        this.game = game
        this.uiRoot = uiRoot
    }
    onEnter() {
        const { uiRoot, game } = this
        this.teardownUI = initUI({ uiRoot, onPlay: () => {
            game.switchScreen(GAME)
        } })
    }
    onExit() {
        this.teardownUI()
    }
}

export default MainMenuScreen