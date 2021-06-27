import { Node } from "@lib"
import { createAtlas } from "@lib/entities/TexRegion"
import TiledLevel from "@utils/TiledLevel"
import ParticleEmitter from "@utils/ParticleEmitter"

import Crate from "@entities/Crate"
import levelDataId from "@assets/levels/level.cson"
import texatlasId from "@assets/images/texatlas.png"
import texatlasMetaId from "@assets/images/atlasmeta.cson"
import fireDataId from "@assets/particles/fire.cson"

class Level1 extends Node {
    constructor({ player, assetsCache, camera }) {
        super()
        const crate = new Crate({ id: "crate", width: 50, height: 50, pos: { x: 200, y: 0 } })
        const texatlas = createAtlas({ 
            metaId: texatlasMetaId,
            imgId: texatlasId
        })
        const arena = new TiledLevel({ 
            data: assetsCache.get(levelDataId),
            texatlas,
            factories: {
                fire: (x, y) => {
                    return new ParticleEmitter(Object.assign(
                        assetsCache.get(fireDataId), { pos: { x, y }, imgId: texatlasId, metaId: texatlasMetaId }
                    ))
                }
            }
        })

        arena.pos.y = 200
        arena.pos.x = 100
        camera.world =  { width: 6000, height: window.innerHeight }
        this.player = player

        this.add(arena)
        this.add(crate)
        this.add(player)
    }

}

export default Level1