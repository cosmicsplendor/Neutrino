import startGameLoop from "./startGameLoop"
import AssetsCache from "@utils/AssetsCache"

class Game {
    activeScreen = null
    assetsCache = new AssetsCache()
    constructor({ renderer, screenFactories, activeScreen, update =() => {} }) {
        const screenNames = Object.keys(screenFactories)
        screenNames.forEach(screenName => {
            const createScreen = screenFactories[screenName]
            this[screenName] = createScreen(this)
        })
        this.renderer = renderer
        this.update = update
        if (activeScreen) { this.switchScreen(activeScreen) }
    }
    switchScreen(name, ...params) {
        if (this.activeScreen && this.activeScreen.onExit) {
            this.activeScreen.onExit()
        }
        this.activeScreen = this[name]
        this.renderer.scene = this.activeScreen
        if (this.activeScreen.background) { this.renderer.changeBackground(this.activeScreen.background) }
        if (this.activeScreen.onEnter) { this.activeScreen.onEnter(...params) }
    }
    start() {
        this.loopControls = startGameLoop({
            mainUpdateFn: dt => this.update(dt),
            renderer: this.renderer
        })
    }
    pause() {
        this.loopControls.pause()
        // this.audioSystem.pause()
    }
    resume() {
        this.loopControls.resume()
        // this.audioSystem.resume()
    }
}

export default Game