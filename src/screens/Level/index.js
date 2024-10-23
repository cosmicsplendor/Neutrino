import { Node } from "@lib"
import { GAME } from "@screens/names"
import resumeImgId from "@assets/images/ui/resume.png"
import arrowImgId from "@assets/images/ui/arrow.png"
import SoundSprite from "@utils/Sound/SoundSprite"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"
import config from "@config"

import initUI from "./initUI"
import { placeBg } from "../utils"

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

            this.teardownBg = placeBg(this, assetsCache, null, game.renderer.api)

        })
    }
    onEnter(fromMenu, advance) { // second level tells whether to advance to the next level (relative to the current one)
        const { game, storage, uiRoot, contSound, chSound, errSound } = this
        if (fromMenu) {
            this.contSound.play()
            this.curLevel = storage.getCurLevel()
        } else if (advance) {
            this.curLevel = Math.min(this.curLevel + 1, config.levels)
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
            errSound,
            syncColor: () => {
                game.renderer.changeBackground("rgb(17, 34, 55)")
                if (this.container) {
                    this.container.overlay = [0.033203125,0.06640625,0.107421875]
                }
            }
        })
    }
    onExit() {
        this.teardownUI()
        this.teardownBg()
        this.teardownUI = null
    }
}

export default LevelScreen