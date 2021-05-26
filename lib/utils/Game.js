
class Game {
    assetsCache = null
    constructor({ renderer, screens, activeScreen }) {
        const screens = Object.values(screens)
        screens.forEach(screen => {
            screen.game = this // property injection
        })
        this.switchScreen(activeScreen)
        this.renderer = renderer
        this.loopControls = startGameLoop({
            mainUpdateFn: dt => this.update(dt),
            renderer: this.renderer
        })
    }
    switchScreen(name, ...params) {
        this.activeScreen = this.screens[name]
        this.activeScreen.onEnter(...params)
        this.scene = this.activeScreen.scene
    }
    set scene(scene) {
        this.renderer.scene = scene
    }
    update(dt) {
        this.activeScreen.update(dt)
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