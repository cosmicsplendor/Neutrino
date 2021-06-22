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
                pos: { x: 830, y: 190 }, imgId: texatlasId, metaId: texatlasMetaId, ...JSON.parse(`{
                    "blendMode": "color-dodge",
                    "loop": true,
                    "size": 100,
                    "params": [
                        {
                            "alphaDecayFn": "",
                            "weight": 1,
                            "frame": "fire_1",
                            "offsetX": [
                                0,
                                40
                            ],
                            "offsetY": [
                                0,
                                0
                            ],
                            "lifetime": [
                                1,
                                2.6
                            ],
                            "velX": [
                                -16,
                                6
                            ],
                            "velY": [
                                -94,
                                -56
                            ],
                            "accX": [
                                0,
                                0
                            ],
                            "accY": [
                                40,
                                40
                            ],
                            "alpha": [
                                0.9,
                                1
                            ],
                            "rotation": [
                                3,
                                3
                            ],
                            "angularVel": [
                                16,
                                16
                            ]
                        }
                    ],
                    "randomDistribution": true
                }`)
        }))
    }

}

export default Level1