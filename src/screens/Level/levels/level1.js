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
        super({ ...cameraProps, world: { width: 6000, height: window.innerHeight * 3 } })
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
                    player.body.pos.x = x
                    player.body.pos.y = y
                    try {
                        player.remove()
                    } catch (e) { console.log(e) }
                    return player
                }
            }
        })

        this.player = player
        this.setSubject(player.body)
                                                                                                                                                                                                                                                                                                                                                                 
        this.add(arena)
        arena.add(crate)
    }

}

export default Level1