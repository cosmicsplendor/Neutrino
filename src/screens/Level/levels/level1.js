import { Camera } from "@lib"
import TiledLevel from "@utils/TiledLevel"

import initUI from "./initUI"

import levelDataId from "@assets/levels/level.cson"

class Level1 extends Camera {
    constructor({ player, uiRoot, assetsCache, bg, fbg, factories, ...cameraProps }) {
        const arena = new TiledLevel({ 
            data: assetsCache.get(levelDataId),
            bg, fbg, player,
            factories
        })
        super({ ...cameraProps, world: { width: arena.width, height: arena.height } })

        this.player = player
                                                                                                                                                                                                                                                                                                                                                                 
        this.add(arena)
        this.gTint = [ 0.1, -0, -0.1, 0 ]
        const teardownUI = initUI(uiRoot, player)
        this.onRemove = () => teardownUI()
        // music.play()
    }
}

export default Level1