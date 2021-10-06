import { Node } from "@lib"
import { GAME } from "@screens/names"
import resumeImgId from "@assets/images/ui/resume.png"
import arrowImgId from "@assets/images/ui/arrow.png"

import initUI from "./initUI"

class LevelScreen extends Node {
    background = "#16161d"
    constructor({ game, uiRoot, storage }) {
        super()
        this.game = game
        this.storage = storage
        this.uiRoot = uiRoot
    }
    onEnter() {
        const { game, storage, uiRoot } = this
        this.teardownUI = initUI({
            onStart: level => {
                game.switchScreen(GAME, level)
            },
            uiRoot,
            images: {
                arrow: game.assetsCache.get(arrowImgId),
                resume: game.assetsCache.get(resumeImgId)
            },
            assetsCache: game.assetsCache,
            storage
        })
    }
    onExit() {
        this.teardownUI()
    }
}

export default LevelScreen