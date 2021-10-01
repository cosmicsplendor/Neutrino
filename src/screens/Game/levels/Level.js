import { Camera } from "@lib"
import TiledLevel from "@utils/TiledLevel"

import initUI from "./initUI"

class Level1 extends Camera {
    constructor({ player, uiRoot, data, bg, fbg, factories, levelDataId, ...cameraProps }) {
        const arena = new TiledLevel({ 
            data,
            bg, fbg, player,
            factories
        })
        super({ ...cameraProps, world: { width: arena.width, height: arena.height } })

        this.player = player
                                                                                                                                                                                                                                                                                                                                                                 
        this.add(arena)
        const teardownUI = initUI(uiRoot, player)
        this.onRemove = () => teardownUI()
        // music.play()
    }
}

export default Level1