import { Node } from "@lib"
import { createAtlas } from "@lib/entities/TexRegion"
import TiledLevel from "@utils/TiledLevel"

import Crate from "@entities/Crate"
import levelDataId from "@assets/levels/level.cson"
import texatlasId from "@assets/images/texatlas.png"
import texatlasMetaId from "@assets/images/atlasmeta.cson"

class Level1 extends Node {
    constructor({ player, assetsCache}) {
        super()
        const crate = new Crate({ id: "crate", width: 50, height: 50, pos: { x: 200, y: 0 } })

        const texatlas = createAtlas({ 
            metaId: texatlasMetaId,
            imgId: texatlasId
        })
        const arena = new TiledLevel({ 
            data: assetsCache.get(levelDataId),
            texatlas
        })

        arena.pos.y = 100
        this.world =  { width: arena.width, height: window.innerHeight }
        this.player = player

        this.add(arena)
        this.add(crate)
        this.add(player)
    }

}

export default Level1