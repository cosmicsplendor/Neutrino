import { Camera } from "@lib"
import TiledLevel from "@utils/TiledLevel"

class Level extends Camera {

    constructor({ player, uiRoot, data, bg, fbg, factories, levelDataId, uiImages, storage, onStateChange, music, ...cameraProps }) {
        const arena = new TiledLevel({ 
            data,
            bg, fbg, player,
            factories
        })
        super({ ...cameraProps, world: { width: arena.width, height: arena.height } })

        this.player = player
        this.music = music                                                                                                                                                                                                                                                                                                                                           
        this.add(arena)
        this.resetRecursively = () => {
            arena.resetRecursively()
        }
    }
    update(dt) {
        super.update(dt)
        this.music && !this.music.playing && this.music.play()
    }
    onRemove() {
        this.music && this.music.pause()
    }
}

export default Level