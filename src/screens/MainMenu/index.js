import { Node } from "@lib"
import config from "@config"
import { calcAligned, getGlobalPos } from "@utils/entity"
import { LEVEL } from "@screens/names"
import Title from "./Title"
import initUI from "./initUI"
import { placeBg } from "../utils"
import { hexToNorm } from "@lib/utils/math"
import mainmenuData from "../../assets/levels/mainmenu.cson"
import TiledLevel from "@lib/utils/TiledLevel"
import { TexRegion } from "@lib/index"

// tint "0.025, -0.025, -0.0125, 0"
class MainMenuScreen extends Node {
    background="#333333"
    constructor({ game, uiRoot, sdk }) {
        super()
        this.game = game
        this.uiRoot = uiRoot
        this.sdk = sdk
        game.assetsCache.once("load", () => {
            const { viewport } = config
            this.gameTitle = new Title()
            this.realign = vp => {
                const { devicePixelRatio } = config
                this.gameTitle.pos = { ...calcAligned({
                    x: 0, y:0, width: vp.width * devicePixelRatio, height: vp.height * devicePixelRatio
                }, { width: this.gameTitle.width, height: this.gameTitle.height }, "center", "top", 15, 80) }
            }
            viewport.on("change", this.realign)
            this.realign(viewport)
            placeBg(this, game.assetsCache, [0.05, 0.05, 0.05], game.renderer.api)
            const data = game.assetsCache.get(mainmenuData)
            const graphic = new TiledLevel({ player: {}, data, scale: { x: 0.5, y: 0.5 }, factories: {
                default: (x, y, props) => {
                    return new TexRegion({ pos: { x, y }, frame: props.name })
                },
            } })
            graphic.pos.x = data.width / 4
            graphic.pos.y = data.height
            this.add(graphic)
            this.add(this.gameTitle)

        })
    }
    onEnter() {
        const { uiRoot, game, sdk } = this
        this.teardownUI = initUI({ uiRoot, onPlay: () => {
            // on play button click
            const proceed = () => game.switchScreen(LEVEL, true)
            uiRoot.clear()
            if (!config.prerollAd) {
                return proceed()
            }
            sdk.prerollAd()
                .then(proceed)
                .catch(proceed)
        }})
    }
    onExit() {
        this.teardownUI()
        config.viewport.off("change", this.realign)
    }
}

export default MainMenuScreen