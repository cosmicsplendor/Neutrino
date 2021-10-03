import { Camera } from "@lib"
import TiledLevel from "@utils/TiledLevel"


import initUI from "./initUI"

class Level extends Camera {
    constructor({ player, uiRoot, data, bg, fbg, factories, levelDataId, uiImages, storage, ...cameraProps }) {
        const arena = new TiledLevel({ 
            data,
            bg, fbg, player,
            factories
        })
        super({ ...cameraProps, world: { width: arena.width, height: arena.height } })

        this.player = player
                                                                                                                                                                                                                                                                                                                                                                 
        this.add(arena)
        const teardownUI = initUI(uiRoot, player, uiImages, storage)
        this.onRemove = () => teardownUI()
        // music.play()
    }
}

export default Level