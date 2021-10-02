import { Node } from "@lib"
import levels from "@config/levels"
import { GAME } from "@screens/names"

import initUI from "./initUI"

class LevelScreen extends Node {
    constructor({ game, uiRoot, storage }) {
        super()
        this.game = game
        this.storage = storage
        this.uiRoot = uiRoot
    }
    onEnter() {
        this.teardownUI = initUI({
            onStart: level => {
                this.game.switchScreen(GAME, level)
            },
            curLevel: this.storage.getCurLevel(),
            uiRoot: this.uiRoot,
            levels
        })
    }
    onExit() {
        this.teardownUI()
    }
}

export default LevelScreen