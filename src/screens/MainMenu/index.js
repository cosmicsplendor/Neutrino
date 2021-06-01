import { Node } from "@lib"
import initUI from "./initUI"
import { LEVEL } from "@screens/names"
import bgMusicUrl from "@assets/audio/music2.wav"
import Sound from "@utils/Sound"


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
            const bgMusic = new Sound(this.game.assetsCache.get(bgMusicUrl))
            bgMusic.play()
            game.switchScreen(LEVEL)
        } })
    }
    onExit() {
        this.teardownUI()
    }
}

export default MainMenuScreen