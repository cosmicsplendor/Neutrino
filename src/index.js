import Game from "@utils/Game"
import UI from "@utils/UI"
import createRenderer from "@lib/renderer/create"
import AssetsCache from "@utils/AssetsCache"
import TexRegion from "@lib/entities/TexRegion"
import Storage from "./helpers/Storage"

import config from "@config"
import levels from "@config/levels"
import * as screenNames from "@screens/names"
import LoadingScreen from "@screens/Loading"
import MainMenuScreen from "@screens/MainMenu"
import GameScreen from "@screens/Game"
import LevelScreen from "@screens/Level"

import soundSprite from "@assets/audio/sprite.mp3"
import soundSpriteMeta from "@assets/audio/sprite.cson"
import texatlasId from "@assets/images/texatlas.png"
import atlasmetaId from "@assets/images/atlasmeta.cson"
import bgDataId from "@assets/levels/background.cson"
import fireDataId from "@assets/particles/fire.cson"
import orbDataId from "@assets/particles/orb.cson"
import shardDataId from "@assets/particles/shard.cson"
import cinderDataId from "@assets/particles/cinder.cson"
import crateUpDataId from "@assets/particles/crate-up.cson"
import crateDownDataId from "@assets/particles/crate-down.cson"
import windDataId from "@assets/particles/wind.cson"
import arrowImgId from "@assets/images/ui/arrow.png"
import crossImgId from "@assets/images/ui/cross.png"
import orbImgId from "@assets/images/ui/orb.png"
import pauseImgId from "@assets/images/ui/pause.png"
import resetImgId from "@assets/images/ui/reset.png"
import resumeImgId from "@assets/images/ui/resume.png"

const { viewport } = config
const renderer = createRenderer({ cnvQry: "#arena", scene: null, background: "#000000", viewport }) // scene will be injected by game
const assetsCache = new AssetsCache()
const storage = new Storage(config.storageId)
const uiRoot = UI.query("#ui-layer")
const curLevel = storage.getCurLevel()
const assets = [
    { url: soundSprite, msg: "loading audio sprite" },
    { url: soundSpriteMeta, msg: "loading audio sprite metadata"},
    { url: texatlasId, msg: "loading images" },
    { url: atlasmetaId, msg: "loading texture atlas" },
    { url: levels[curLevel - 1].id, msg: "loading level data" }, // pre-load the current level
    { url: fireDataId, msg: "loading particles" },
    orbDataId,
    cinderDataId,
    shardDataId,
    crateUpDataId,
    crateDownDataId,
    windDataId,
    { url: arrowImgId, msg: "loading ui assets" },
    crossImgId,
    orbImgId,
    pauseImgId,
    resetImgId,
    resumeImgId,
]
if (!config.mobile) {
    assets.push(bgDataId)
}
const screenFactories = {
    [screenNames.LOADING]: game => new LoadingScreen({ game, assets }),
    [screenNames.MAIN_MENU]: game => new MainMenuScreen({ game, uiRoot }),
    [screenNames.GAME]: game => new GameScreen({ game, uiRoot, storage }),
    [screenNames.LEVEL]: game => new LevelScreen({ game, uiRoot, storage }),
}
const game = new Game({
    renderer,
    assetsCache,
    storage,
    screenFactories,
})
assetsCache.once("prog-end", () =>  { // listening to "progress-end" instead of "load" to ensure critical engine setup tasks happen before emission of load event
    const atlasmeta = assetsCache.get(atlasmetaId)
    renderer.setTexatlas(
        assetsCache.get(texatlasId),
        atlasmeta
    )
    TexRegion.injectAtlasmeta(atlasmeta)
})
game.switchScreen(screenNames.LOADING)
game.start()