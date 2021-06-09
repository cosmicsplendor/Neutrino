import { Node } from "@lib"
import initUI from "./initUI"
import { LEVEL } from "@screens/names"
import SoundAtlas from "@utils/Sound/SoundAtlas"

import soundAtlasFile from "@assets/audio/sprite.mp3"
import soundAtlasMeta from "@assets/audio/sprite.cson"

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
            const soundAtlas = new SoundAtlas({ resourceID: soundAtlasFile, meta: soundAtlasMeta, assetsCache: game.assetsCache })
            game.switchScreen(LEVEL, soundAtlas)
        } })
    }
    onExit() {
        this.teardownUI()
    }
}

export default MainMenuScreen