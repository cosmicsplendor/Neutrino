import { Camera } from "@lib"
import TiledLevel from "@utils/TiledLevel"

class Level extends Camera {

    constructor({ player, uiRoot, data, bg, fbg, factories, levelDataId, uiImages, storage, onStateChange, ...cameraProps }) {
        const arena = new TiledLevel({ 
            data,
            bg, fbg, player,
            factories
        })
        super({ ...cameraProps, world: { width: arena.width, height: arena.height } })

        this.player = player
                                                                                                                                                                                                                                                                                                                                                                 
        this.add(arena)
        this.resetRecursively = () => {
            arena.resetRecursively()
        }
    }
}

export default Level