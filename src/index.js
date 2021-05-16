import { Camera, Canvas2DRenderer, Texture } from "@lib"
import { startGameLoop } from "@utils"
import config from "@config"
import Wall from "@entities/Wall"
import Player from "./entities/Player"
import bgMusicUrl from "./assets/audio/music2.wav"
import AssetsCache from "@lib/utils/AssetsCache"
import Sound from "@lib/utils/Sound"

console.log({ bgMusicUrl })

const assetsCache = new AssetsCache()
assetsCache.load([
    { url: bgMusicUrl, msg: "Loading sound" }
 ])
Texture.initialize(assetsCache)

assetsCache.once("load", () => {
    const { viewport: canvasDimensions } = config
    alert()
    const music = new Sound(assetsCache.get(bgMusicUrl))
    alert()
    music.play()

    const gameWorld = new Camera({ id: "root", viewport: canvasDimensions, world: { ...canvasDimensions, width: 1000 } })

    const wall = new Wall({ id: "wall" })
    const player = new Player({ width: 24, height: 24, fill: "goldenrod", id: "player" })

    gameWorld.setSubject(player)
    gameWorld.add(wall)
    gameWorld.add(player)

    const renderer = new Canvas2DRenderer({ canvasId: "arena", scene: gameWorld, background: "black", ...canvasDimensions })

    const mainUpdateFn = dt => { 
        // console.log(`Frame Rate: ${1 / dt}`)
    }

    const loopControls = startGameLoop({
        mainUpdateFn,
        renderer
    })
    // loopControls.setSpeed(0.5)
    // console.log(loopControls.meta.elapsed)
    // setTimeout(() => loopControls.pause(), 6000)
})

assetsCache.on("error", e => {
    console.log(e)
})

assetsCache.on("progress", ({ progress, msg }) => {
    console.log(`Loading progress: ${progress}%`)
    console.log(`Loading message: ${msg}`)
})