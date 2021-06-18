import startGameLoop from "./startGameLoop"
import Texture from "@lib/entities/Texture"
import TexRegion from "@lib/entities/TexRegion"

class Game {
    _activeScreen = null
    constructor({ renderer, assetsCache, screenFactories, activeScreen }) {
        this._assetsCache = assetsCache
        this._renderer = renderer

        const screenNames = Object.keys(screenFactories)
        screenNames.forEach(screenName => {
            const createScreen = screenFactories[screenName]
            this[screenName] = createScreen(this)
            this[screenName].name = screenName
        })

        Texture.injectAssetsCache(assetsCache)
        TexRegion.injectAssetsCache(assetsCache)
        if (activeScreen) { this.switchScreen(activeScreen) }
    }
    get assetsCache() { return this._assetsCache}
    switchScreen(screenName, ...params) {
        if (this._activeScreen) {
            this._activeScreen.onExit()
        }
        this._activeScreen = this[screenName]
        this._renderer.scene = this._activeScreen
        if (this._activeScreen.background) { this._renderer.changeBackground(this._activeScreen.background) }
        this._activeScreen.onEnter(...params)
    }
    disposeScreen(screen) {
        this[screen.name] = null
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