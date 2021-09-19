import Orb from "@entities/Orb"
import Gate from "@entities/Gate"
import Magnet from "@entities/Magnet"
import Ball from "@entities/Ball"
import SawBlade from "@entities/SawBlade"
import Fire from "@entities/Fire"
import Crate from "@entities/Crate"
import Pool from "@utils/Pool"

import texatlasId from "@assets/images/texatlas.png"
import atlasmetaId from "@assets/images/atlasmeta.cson"
import fireDataId from "@assets/particles/fire.cson"
import orbDataId from "@assets/particles/orb.cson"

const getDefault = EClass => (x, y, props) => {
    return new EClass({
        pos: { x, y },
        ...props
    })
}

export default ({ soundSprite, assetsCache }) => { // using sound sprite to create and pass objects and (cached) pools so that objects can just consume sound in ready-to-use form rather than by creating them on their own. This helps me make sound creation parameters changes at one place, making code more scalable.
    const gMovSound = soundSprite.createPool("gate")
    const orbMovSound = soundSprite.create("orb_mov")
    const orbFactory = (x, y, props, player) => {
        return new Orb(Object.assign(
            assetsCache.get(orbDataId),
            { metaId: atlasmetaId, imgId: texatlasId, player, pos: { x, y }, sound: soundSprite.create("orb"), movSound: orbMovSound },
            props
        ))
    }
    const orbPool = new Pool({
        factory: orbFactory,
        size: 3,
        free(obj) {
            obj.remove() // remove the object from it's parent
        },
        reset(obj, x, y) {
            obj.pos.x = x
            obj.pos.y = y
        }
    })
    const fire = new Fire(assetsCache.get(fireDataId))
    return ({
        gate: (x, y, props, player) => {
            return new Gate({
                pos: { x, y },
                colSound: null,
                movSound: gMovSound,
                player,
                ...props
            })
        },
        orb: orbPool.create.bind(orbPool),
        fire: (x, y, _, player) => {
            fire.parent && fire.remove()
            fire.player = player
            fire.pos.x = x
            fire.pos.y = y
            return fire
        },
        magnet: (x, y) => {
            return new Magnet({ pos: { x, y }, frame: "magnet" })
        },
        ball: (x, y, props, player) => {
            return new Ball(x, y, props.seq, player)
        },
        sb1: (x, y, props, player) => {
            return new SawBlade(x, y,  "sb1", props.toX, props.toY, props.speed, player)
        },
        sb2: (x, y, props, player) => {
            return new SawBlade(x, y,  "sb2", props.toX, props.toY, props.speed, player)
        },
        sb3: (x, y, props, player) => {
            return new SawBlade(x, y,  "sb3", props.toX, props.toY, props.speed, player)
        },
        lcr1: (x, y, props, player) => {
            return new Crate(x, y)
        }
    })
}