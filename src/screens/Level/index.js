import { Node } from "@lib"
import { GAME } from "@screens/names"
import resumeImgId from "@assets/images/ui/resume.png"
import arrowImgId from "@assets/images/ui/arrow.png"
import SoundSprite from "@utils/Sound/SoundSprite"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"
import levels from "@config/levels"

import initUI from "./initUI"

class LevelScreen extends Node {
    background = "#000000"
    curLevel = 0
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
            this.contSound = soundSprite.createPool("continue")
            this.chSound = soundSprite.createPool("change") 
            this.errSound = soundSprite.createPool("error")
        })
    }
    onEnter(fromMenu, advance) { // second level tells whether to advance to the next level (relative to the current one)
        const { game, storage, uiRoot, contSound, chSound, errSound } = this
        if (fromMenu) {
            this.contSound.play()
            this.curLevel = storage.getCurLevel()
        } else if (advance) {
            this.curLevel = Math.min(this.curLevel + 1, levels.length)
        }
        this.teardownUI = initUI({
            onStart: level => {
                game.switchScreen(GAME, level)
                this.curLevel = level
            },
            uiRoot,
            images: {
                arrow: game.assetsCache.get(arrowImgId),
                resume: game.assetsCache.get(resumeImgId)
            },
            assetsCache: game.assetsCache,
            storage,
            level: this.curLevel,
            maxLevel: storage.getCurLevel(),
            contSound,
            chSound,
            errSound
        })
    }
    onExit() {
        this.teardownUI()
    }
}

export default LevelScreen