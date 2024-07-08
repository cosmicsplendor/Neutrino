import { Node } from "@lib"
import { GAME } from "@screens/names"
import resumeImgId from "@assets/images/ui/resume.png"
import arrowImgId from "@assets/images/ui/arrow.png"
import SoundSprite from "@utils/Sound/SoundSprite"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"
import levels from "@config/levels"
import config from "@config"
import { calcAligned } from "@lib/utils/entity"
import atlasmetaId from "@assets/images/atlasmeta.cson"
import TexRegion from "@lib/entities/TexRegion"
import bgDataId from "@assets/levels/background.cson"
import initUI from "./initUI"
import { hexToNorm } from "@lib/utils/math"
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
    { "bg":"rgb(18 18 18)", "mob_bg":"rgb(18 18 18)", "pxbg":"0.090, 0.090, 0.090" }
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

            if (config.isMobile) {
                return
            }
            const bgData = assetsCache.get(bgDataId)
            this.container = new Node()
            bgData.forEach(tile => {
                this.container.add(new TexRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }}))
            })
            this.container.pos.y = -1016
            console.log(this.container)
            const atlasMeta = assetsCache.get(atlasmetaId)
            const height = bgData.reduce((max, tile) => Math.max(max, tile.y + atlasMeta[tile.name].height), 0) + this.container.pos.y
            this.container.overlay = [0.03529411764705882, 0.03529411764705882, 0.03529411764705882]
            this.add(this.container)

            const realignBg = viewport => {
                const aligned = calcAligned(viewport, { width: config.viewport.width, height: height },"center", "bottom")
                this.container.pos.y = aligned.y - 1016
            }

            realignBg(config.viewport)
            config.viewport.on("change", () => realignBg(config.viewport))
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
                if (!config.isMobile) {
                    this.container.overlay = data.pxbg && hexToNorm(data.pxbg)
                }
            }
        })
    }
    onExit() {
        this.teardownUI()
    }
}

export default LevelScreen