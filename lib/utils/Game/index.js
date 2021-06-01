import startGameLoop from "./startGameLoop"
import AssetsCache from "@utils/AssetsCache"

class Game {
    _activeScreen = null
    assetsCache = new AssetsCache()
    constructor({ renderer, screenFactories, activeScreen }) {
        const screenNames = Object.keys(screenFactories)
        screenNames.forEach(screenName => {
            const createScreen = screenFactories[screenName]
            this[screenName] = createScreen(this)
        })
        this._renderer = renderer
        if (activeScreen) { this.switchScreen(activeScreen) }
    }
    switchScreen(screenName, ...params) {
        if (this._activeScreen) {
            this._activeScreen.onExit()
        }
        this._activeScreen = this[screenName]
        this._renderer.scene = this._activeScreen
        if (this._activeScreen.background) { this._renderer.changeBackground(this._activeScreen.background) }
        this._activeScreen.onEnter(...params)
    }
    _update(dt, t) {
       if (this._activeScreen.update) {
           this._activeScreen.update(dt, t)
       }
    }
    start() {
        this.loopControls = startGameLoop({
            mainUpdateFn: (dt, t) => this._update(dt, t),
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