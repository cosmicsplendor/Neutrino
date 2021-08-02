import { Camera } from "@lib"
import { createAtlas } from "@lib/entities/TexRegion"
import TiledLevel from "@utils/TiledLevel"
import ParticleEmitter from "@utils/ParticleEmitter"

import levelDataId from "@assets/levels/level.cson"
import texatlasId from "@assets/images/texatlas.png"
import texatlasMetaId from "@assets/images/atlasmeta.cson"
import fireDataId from "@assets/particles/fire.cson"

class Level1 extends Camera {
    constructor({ player, assetsCache, bg, fbg, ...cameraProps }) {
        const texatlas = createAtlas({ 
            metaId: texatlasMetaId,
            imgId: texatlasId
        })
        const factories = {
            fire: (x, y) => {
                const fire = new ParticleEmitter(Object.assign(
                    assetsCache.get(fireDataId), { pos: { x, y }, imgId: texatlasId, metaId: texatlasMetaId }
                ))
                return fire
            },
        }
        const arena = new TiledLevel({ 
            id: "arena",
            data: assetsCache.get(levelDataId),
            texatlas,
            bg, fbg, player,
            factories
        })
        super({ ...cameraProps, world: { width: arena.width, height: arena.height } })

        this.player = player
        player.injectLevel(arena)
                                                                                                                                                                                                                                                                                                                                                                 
        this.add(arena)
    }

}

export default Level1