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
//     const { viewport: canvasDimensions } = config
//     const music = new Sound(assetsCache.get(bgMusicUrl))
//     // music.play()

//     const wall = new Wall({ crestID: "wall", blockWidth: 50, blockHeight: 50 })
//     const gameWorld = new Camera({ id: "root", viewport: canvasDimensions, world: { width: wall.width, height: wall.height } })

//     const player = new Player({ width: 24, height: 24, fill: "brown", id: "player", speed: 100, pos: { x: 2050 } })
//     const crate = new Crate({ id: "crate", width: 50, height: 50, pos: { x: 2000, y: 0 } })

    
//     gameWorld.setSubject(player)
//     gameWorld.add(wall)
//     gameWorld.add(crate)
//     gameWorld.add(player)

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
import { Canvas2DRenderer } from "@lib"

import config from "@config"
import * as screenNames from "./screens/names"
import LoadingScreen from "./screens/Loading"

const { viewport } = config
const renderer = new Canvas2DRenderer({ canvasID: "arena", scene: null, background: "skyblue", width: viewport.width, height: viewport.height })
// const uiLayer = new uiLayer({ id: "ui-layer", viewport: config.viewport })
const screenFactories = {
    [screenNames.LOADING]: game => new LoadingScreen({ game })
}

const game = new Game({
    renderer,
    screenFactories
})

viewport.on("change", ({ width, height }) => renderer.resize({ width, height }))

game.switchScreen(screenNames.LOADING)
game.start()