// import { Node, Camera, Canvas2DRenderer, Texture } from "@lib"
// import config from "@config"
// import Wall from "@entities/Wall"
// import Player from "./entities/Player"
// import bgMusicUrl from "./assets/audio/music2.wav"
// import AssetsCache from "@lib/utils/AssetsCache"
// import Sound from "@lib/utils/Sound"
// import Crate from "@entities/Crate"

// console.log({ bgMusicUrl })

// const assetsCache = new AssetsCache()
// assetsCache.load([
//     { url: bgMusicUrl, msg: "Loading sound" }
//  ])
// Texture.initialize(assetsCache)

// assetsCache.once("load", initialize)

// assetsCache.on("error", e => {
//     console.log(e)
// })

// assetsCache.on("progress", ({ progress, msg }) => {
//     console.log(`Loading progress: ${progress}%`)
//     console.log(`Loading message: ${msg}`)
// })

// function initalize() {


//     const renderer = new Canvas2DRenderer({ canvasID: "arena", scene: gameWorld, background: "skyblue", ...canvasDimensions })
//     const mainUpdateFn = dt => { 
//         // console.log(`Frame Rate: ${Math.round(1 / dt)}`)
//     }

//     const loopControls = startGameLoop({
//         mainUpdateFn,
//         renderer
//     })
//     // loopControls.setSpeed(0.5)
//     // console.log(loopControls.meta.elapsed)
//     // setTimeout(() => loopControls.pause(), 6000)
// }
import Game from "@utils/Game"
import UI from "@utils/UI"
import { Canvas2DRenderer } from "@lib"

import config from "@config"
import * as screenNames from "@screens/names"
import LoadingScreen from "@screens/Loading"
import MainMenuScreen from "@screens/MainMenu"
import LevelScreen from "@screens/Level"

const { viewport } = config
const renderer = new Canvas2DRenderer({ canvasID: "arena", scene: null, background: "skyblue", width: viewport.width, height: viewport.height }) // scene will be injected by game
const uiRoot = new UI("#ui-layer")
const screenFactories = {
    [screenNames.LOADING]: game => new LoadingScreen({ game }),
    [screenNames.MAIN_MENU]: game => new MainMenuScreen({ game, uiRoot }),
    [screenNames.LEVEL]: game => new LevelScreen({ game })
}

const game = new Game({
    renderer,
    screenFactories
})

viewport.on("change", ({ width, height }) => renderer.resize({ width, height }))

game.switchScreen(screenNames.LOADING)
game.start()