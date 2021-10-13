import { Node } from "@lib"
import resumeImgId from "@assets/images/ui/resume.png"
import { LEVEL } from "@screens/names"
import initUI from "./initUI"

class MainMenuScreen extends Node {
    background = "#000000"
    constructor({ game, uiRoot }) {
        super()
        this.game = game
        this.uiRoot = uiRoot
    }
    onEnter() {
        const { uiRoot, game } = this
        this.teardownUI = initUI({ uiRoot, btnImg: game.assetsCache.get(resumeImgId), onPlay: () => {
            game.switchScreen(LEVEL, true)
        }})
    }
    onExit() {
        this.teardownUI()
    }
}

export default MainMenuScreen