import { Camera } from "@lib"
import { createAtlas } from "@lib/entities/TexRegion"
import TiledLevel from "@utils/TiledLevel"
import ParticleEmitter from "@utils/ParticleEmitter"

import Crate from "@entities/Crate"
import levelDataId from "@assets/levels/level.cson"
import texatlasId from "@assets/images/texatlas.png"
import texatlasMetaId from "@assets/images/atlasmeta.cson"
import fireDataId from "@assets/particles/fire.cson"

class Level1 extends Camera {
    constructor({ player, assetsCache, bg, fbg, ...cameraProps }) {
        const crate = new Crate({ id: "crate", width: 50, height: 50, pos: { x: 0, y: 0 } })
        const texatlas = createAtlas({ 
            metaId: texatlasMetaId,
            imgId: texatlasId
        })
        const arena = new TiledLevel({ 
            id: "arena",
            data: assetsCache.get(levelDataId),
            texatlas,
            bg, fbg,
            factories: {
                fire: (x, y) => {
                    return new ParticleEmitter(Object.assign(
                        assetsCache.get(fireDataId), { pos: { x, y }, imgId: texatlasId, metaId: texatlasMetaId }
                    ))
                },
                player: (x, y) => {
                    player.pos.x = x
                    player.pos.y = y
                    player.onRemove = () => delete player.parent
                    return player
                }
            }
        })
        super({ ...cameraProps, world: { width: arena.width, height: arena.height } })

        this.player = player
                                                                                                                                                                                                                                                                                                                                                                 
        this.add(arena)
        arena.add(crate)
    }

}

export default Level1