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
            const data = game.assetsCache.get(mainmenuData)
            this.gameTitle = new Title()
            const graphic = new TiledLevel({ player: {}, data, scale: { x: 0.5, y: 0.5 }, factories: {
                default: (x, y, props) => {
                    return new TexRegion({ pos: { x, y }, frame: props.name })
                },
            } })
            game.renderer.tint = [ 0.05, 0.0125, 0.025 ]
            this.graphic = graphic
            this.realign = vp => {
                const { devicePixelRatio } = config
                this.gameTitle.pos = { ...calcAligned({
                    x: 0, y:0, width: vp.width * devicePixelRatio, height: vp.height * devicePixelRatio
                }, { width: this.gameTitle.width, height: this.gameTitle.height }, "center", "top", 15, 80) }
                graphic.pos = { ...calcAligned({
                    x: 0, y:0, width: vp.width * devicePixelRatio, height: vp.height * devicePixelRatio
                }, { width: data.width / 2, height: data.height / 2 }, "center", "top", 15, 80) }
                graphic.pos.y = 210 // offset
            }
            viewport.on("change", this.realign)
            this.realign(viewport)

            placeBg(this, game.assetsCache, [0.05, 0.05, 0.05], game.renderer.api)
            this.add(graphic)
            this.add(this.gameTitle)

            this.init()

        })
    }
    init() {
        const { graphic, gameTitle } = this;

        // Store initial positions
        this.initPositions = {
            graphic: { x: graphic.pos.x, y: graphic.pos.y },
            gameTitle: { x: gameTitle.pos.x, y: gameTitle.pos.y }
        };
        graphic.smooth = true
        graphic.gameTitle = true
        // Set up the necessary parameters
        this.frequency = 0.5;  // Adjust for speed of movement
        this.amplitude = 25;   // Amplitude of oscillation for gameTitle
        this.parallaxFactor = 0.3;  // How much slower graphic moves compared to gameTitle
        console.log(graphic.pos)
    }

    update(dt, t) {
        const { graphic, gameTitle } = this;
        if (!graphic || !gameTitle) return

        // Create smooth sinusoidal movement for gameTitle
        gameTitle.pos.y = this.initPositions.gameTitle.y + Math.sin(t * this.frequency) * this.amplitude;
        // Graphic should move slower with the parallax effect
        graphic.pos.y = this.initPositions.graphic.y + Math.sin(t * this.frequency) * this.amplitude * this.parallaxFactor;
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