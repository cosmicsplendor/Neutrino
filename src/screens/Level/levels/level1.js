import { Camera } from "@lib"
import { createAtlas } from "@lib/entities/TexRegion"
import TiledLevel from "@utils/TiledLevel"
import ParticleEmitter from "@utils/ParticleEmitter"

import initUI from "./initUI"
import createGate from "@factories/gate"

import levelDataId from "@assets/levels/level.cson"
import texatlasId from "@assets/images/texatlas.png"
import texatlasMetaId from "@assets/images/atlasmeta.cson"
import fireDataId from "@assets/particles/fire.cson"

class Level1 extends Camera {
    constructor({ player, uiRoot, assetsCache, bg, fbg, music, ...cameraProps }) {
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
            gate: createGate
        }
        const arena = new TiledLevel({ 
            data: assetsCache.get(levelDataId),
            texatlas,
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