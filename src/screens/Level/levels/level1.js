import { Node } from "@lib"
import { createAtlas } from "@lib/entities/TexRegion"
import TiledLevel from "@utils/TiledLevel"
import ParticleEmitter from "@utils/ParticleEmitter"

import Crate from "@entities/Crate"
import levelDataId from "@assets/levels/level.cson"
import texatlasId from "@assets/images/texatlas.png"
import texatlasMetaId from "@assets/images/atlasmeta.cson"

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
            texatlas
        })

        arena.pos.y = 100
        camera.world =  { width: 6000, height: window.innerHeight }
        this.player = player

        this.add(arena)
        this.add(crate)
        this.add(player)
        this.add(new ParticleEmitter({
            pos: { x: 400, y: 500 }, 
            size: 40,
            metaId: texatlasMetaId,
            imgId: texatlasId,
            params: [
                {
                    frame: "fire_1",
                    lifetime: 1,
                    velX: [ -20, 20 ],
                    velY: [ -100, -40 ],
                    accY: [ -10, 30],
                    weight: 1,
                    alpha: 1,
                    alphaEasingFn: x => 1 - x
                },
                {
                    frame: "fire_2",
                    lifetime: 2,
                    velX: [ -15, 15 ],
                    velY: [ -80, -20 ],
                    accY: [ -10, 30],
                    weight: 2,
                    alpha: 1,
                    alphaEasingFn: x => 1 - x
                }
            ]
        }))
    }

}

export default Level1