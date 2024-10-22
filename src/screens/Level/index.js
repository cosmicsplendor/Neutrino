import { Node } from "@lib"
import { GAME } from "@screens/names"
import resumeImgId from "@assets/images/ui/resume.png"
import arrowImgId from "@assets/images/ui/arrow.png"
import SoundSprite from "@utils/Sound/SoundSprite"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"
import levels from "@config/levels"

import initUI from "./initUI"
import { hexToNorm } from "@lib/utils/math"
import * as rendApis  from "@lib/renderer/apis"
import { placeBg } from "../utils"

const levelColors = [
    { "bg":"#121228","mob_bg":"#121228", "pxbg":"0.058, 0.058, 0.133" },
    { "bg":"#121228","mob_bg":"#000000", "pxbg":"0.058, 0.058, 0.133" },
    { "bg":"#2e2e3d","mob_bg":"#2e2e3d","pxbg":"0.129, 0.129" },
    { "bg":"#10103a","mob_bg":"#0b0b25", "pxbg":"0.043, 0.043, 0.145" },
    { "bg":"#2e2e3d","mob_bg":"#2e2e3d", "pxbg":"0.129, 0.129, 0.184" },
    { "bg":"#171025","mob_bg":"#0f0f22", "pxbg":"0.066, 0.043, 0.109" },
    { "bg":"#0f0f22","mob_bg":"#0f0f22", "pxbg":"0.039, 0.039, 0.090" },
    { "bg":"#0f0f22","mob_bg":"#0f0f22", "pxbg":"0.039, 0.039, 0.090" },
    { "bg":"#132b27","mob_bg":"#132b27", "pxbg": "#0a1614" },
    { "bg":"rgb(18 18 18)", "mob_bg":"rgb(18 18 18)", "pxbg":"0.090, 0.090, 0.090" },
    {"bg":"#132b27","mob_bg":"#132b27","pxbg":"#0a1614","tint":"0.025, -0.025, -0.0125, 0"}
]


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
            errSound,
            syncColor: level => {
                const data = levelColors[level-1]
                game.renderer.changeBackground(data.bg)
                if (this.container) {
                    this.container.overlay = data.pxbg && hexToNorm(data.pxbg)
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