import { Camera } from "@lib"
import TiledLevel from "@utils/TiledLevel"

class Level extends Camera {
    constructor({ player, uiRoot, data, bg, fbg, factories, levelDataId, uiImages, onStateChange, gameState, music, ...cameraProps }) {
        const arena = new TiledLevel({ 
            data,
            bg, fbg, player,
            factories
        })
        super({ ...cameraProps, world: { width: arena.width, height: arena.height } })
        this.gameState = gameState
        this.player = player
        this.music = music                                                                                                                                                                                                                                                                                                                                           
        this.add(arena)
        this.resetRecursively = () => {
            arena.resetRecursively()
        }
    }
    update(dt) {
        super.update(dt)
        if (!this.music) return
        if (this.gameState.is("completed")) return this.music.playing && this.music.pause()

        !this.music.playing && this.music.play()
    }
    onRemove() {
        if (!this.music) return
        this.music.pause()
    }
}

export default Level