import startGameLoop from "./startGameLoop"
import AssetsCache from "@utils/AssetsCache"

class Game {
    _activeScreen = null
    assetsCache = new AssetsCache()
    constructor({ renderer, screenFactories, activeScreen, update =() => {} }) {
        const screenNames = Object.keys(screenFactories)
        screenNames.forEach(screenName => {
            const createScreen = screenFactories[screenName]
            this[screenName] = createScreen(this)
        })
        this._renderer = renderer
        this.update = update
        if (activeScreen) { this.switchScreen(activeScreen) }
    }
    switchScreen(screenName, ...params) {
        if (this._activeScreen && this._activeScreen.onExit) {
            this._activeScreen.onExit()
        }
        this._activeScreen = this[screenName]
        this._renderer.scene = this._activeScreen
        if (this._activeScreen.background) { this._renderer.changeBackground(this._activeScreen.background) }
        if (this._activeScreen.onEnter) { this._activeScreen.onEnter(...params) }
    }
    start() {
        this.loopControls = startGameLoop({
            mainUpdateFn: dt => this.update(dt),
            renderer: this._renderer
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