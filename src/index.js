import Game from "@utils/Game"
import UI from "@utils/UI"
import { Canvas2DRenderer } from "@lib"
import AssetsCache from "@utils/AssetsCache"

import config from "@config"
import * as screenNames from "@screens/names"
import LoadingScreen from "@screens/Loading"
import MainMenuScreen from "@screens/MainMenu"
import LevelScreen from "@screens/Level"

const { viewport } = config
const renderer = new Canvas2DRenderer({ canvasID: "arena", scene: null, background: "skyblue", viewport }) // scene will be injected by game
const assetsCache = new AssetsCache()
const uiRoot = UI.query("#ui-layer")
const screenFactories = {
    [screenNames.LOADING]: game => new LoadingScreen({ game }),
    [screenNames.MAIN_MENU]: game => new MainMenuScreen({ game, uiRoot }),
    [screenNames.LEVEL]: game => new LevelScreen({ game, uiRoot })
}
const game = new Game({
    renderer,
    assetsCache,
    screenFactories
})
const onViewportChange = viewport => {
    document.getElementById("game-container").style.transform = `scale(${viewport.scale})` // scaling up the entire game container
}
viewport.on("change", onViewportChange)
onViewportChange(viewport)
game.switchScreen(screenNames.LOADING)
game.start()