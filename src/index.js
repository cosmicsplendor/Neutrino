import Game from "@utils/Game"
import UI from "@utils/UI"
import { Canvas2DRenderer, Webgl2Renderer } from "@lib"
import AssetsCache from "@utils/AssetsCache"
import TexRegion from "@lib/entities/TexRegion"

import config from "@config"
import * as screenNames from "@screens/names"
import LoadingScreen from "@screens/Loading"
import MainMenuScreen from "@screens/MainMenu"
import LevelScreen from "@screens/Level"

import soundSprite from "@assets/audio/sprite.mp3"
import soundSpriteMeta from "@assets/audio/sprite.cson"
import cartonImg from "@assets/images/carton.png"
import cartonDarkImg from "@assets/images/cartonDark.png"
import texatlasId from "@assets/images/texatlas.png"
import atlasmetaId from "@assets/images/atlasmeta.cson"
import levelDataId from "@assets/levels/level.cson"
import bgDataId from "@assets/levels/background.cson"
import fireDataId from "@assets/particles/fire.cson"
import orbDataId from "@assets/particles/orb.cson"
import shardDataId from "@assets/particles/shard.cson"
import cinderDataId from "@assets/particles/cinder.cson"
import crateUpDataId from "@assets/particles/crate-up.cson"
import crateDownDataId from "@assets/particles/crate-down.cson"
import windDataId from "@assets/particles/wind.cson"

const { viewport } = config
const renderer = new Canvas2DRenderer({ cnvQry: "#arena", scene: null, background: "skyblue", viewport }) // scene will be injected by game
const assetsCache = new AssetsCache()
const uiRoot = UI.query("#ui-layer")
const assets = [
    { url: soundSprite, msg: "loading audio sprite" },
    { url: soundSpriteMeta, msg: "loading audio sprite metadata"},
    { url: cartonImg, msg: "loading Images" },
    { url: cartonDarkImg },
    { url: texatlasId },
    { url: atlasmetaId, msg: "loading texture atlas" },
    { url: levelDataId, msg: "loading level data" },
    { url: bgDataId },
    { url: fireDataId, msg: "loading particles" },
    { url: orbDataId },
    { url: cinderDataId },
    { url: shardDataId },
    { url: crateUpDataId },
    { url: crateDownDataId },
    { url: windDataId },
]
const screenFactories = {
    [screenNames.LOADING]: game => new LoadingScreen({ game, assets }),
    [screenNames.MAIN_MENU]: game => new MainMenuScreen({ game, uiRoot }),
    [screenNames.LEVEL]: game => new LevelScreen({ game, uiRoot })
}
const game = new Game({
    renderer,
    assetsCache,
    screenFactories,
})
const onViewportChange = viewport => {
    document.getElementById("game-container").style.transform = `scale(${viewport.scale})` // scaling up the entire game container
}
viewport.on("change", onViewportChange)
assetsCache.once("prog-end", () =>  { // listening to "progress-end" instead of "load" to ensure critical engine setup tasks happen before emission of load event
    const atlasmeta = assetsCache.get(atlasmetaId)
    renderer.setTexatlas(
        assetsCache.get(texatlasId),
        atlasmeta
    )
    TexRegion.injectAtlasmeta(atlasmeta)
})
onViewportChange(viewport)
game.switchScreen(screenNames.LOADING)
game.start()