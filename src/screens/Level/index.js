import { Node } from "@lib"
import { GAME } from "@screens/names"
import resumeImgId from "@assets/images/ui/resume.png"
import arrowImgId from "@assets/images/ui/arrow.png"
import SoundSprite from "@utils/Sound/SoundSprite"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"

import initUI from "./initUI"

class LevelScreen extends Node {
    background = "#000000"
    constructor({ game, uiRoot, storage }) {
        super()
        this.game = game
        this.storage = storage
        this.uiRoot = uiRoot
        game.assetsCache.once("load", () => {
            const { assetsCache } = game
            const soundSprite = new SoundSprite({ 
                resource: assetsCache.get(soundSpriteId), 
                resourceId: soundSpriteId, 
                meta: assetsCache.get(soundMetaId)
            })
            this.contSound = soundSprite.create("continue")
            this.chSound = soundSprite.createPool("change") 
        })
    }
    onEnter(fromMenu=false) {
        const { game, storage, uiRoot, contSound, chSound } = this
        fromMenu && this.contSound.play()
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
            storage,
            contSound,
            chSound
        })
    }
    onExit() {
        this.teardownUI()
    }
}

export default LevelScreen