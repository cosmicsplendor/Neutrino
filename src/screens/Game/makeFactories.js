import ParticleEmitter from "@lib/utils/ParticleEmitter"
import Orb from "@entities/Orb"
import Gate from "@entities/Gate"
import Wind from "@entities/Wind"
import Magnet from "@entities/Magnet"
import Ball from "@entities/Ball"
import SawBlade from "@entities/SawBlade"
import Fire from "@entities/Fire"
import Crate from "@entities/Crate"
import Pool from "@utils/Pool"

import fireDataId from "@assets/particles/fire.cson"
import orbDataId from "@assets/particles/orb.cson"
import crateUpDataId from "@assets/particles/crate-up.cson"
import crateDownDataId from "@assets/particles/crate-down.cson"
import windDataId from "@assets/particles/wind.cson"

export default ({ soundSprite, assetsCache }) => { // using sound sprite to create and pass objects and (cached) pools so that objects can just consume sound in ready-to-use form rather than by creating them on their own. This helps me make sound creation parameters changes at one place, making code more scalable.
    const gMovSound = soundSprite.createPool("gate")
    const orbMovSound = soundSprite.create("orb_mov")
    
    const windFactory = (x, y, props, player) => {
        return new Wind(
            assetsCache.get(windDataId),
            x, y, player
        )
    }
    const orbFactory = (x, y, props, player) => {
        return new Orb(Object.assign(
            assetsCache.get(orbDataId),
            { player, pos: { x, y }, sound: soundSprite.create("orb"), movSound: orbMovSound },
            props
        ))
    }
    const orbPool = new Pool({
        factory: orbFactory,
        size: 4,
        free(obj) {
            obj.remove() // remove the object from it's parent
        },
        reset(obj, x, y) {
            obj.pos.x = x
            obj.pos.y = y
        }
    })
    const windPool = new Pool({
        factory: windFactory,
        size: 1,
        free(obj) {
            obj.remove()
        },
        reset(obj, x, y) {
            obj.pos.x = x
            obj.pos.y = y - 10
        }
    })
    const fire = new Fire(assetsCache.get(fireDataId))
    const crateParticles = Object.freeze({
        up: new ParticleEmitter(assetsCache.get(crateUpDataId)),
        down: new ParticleEmitter(assetsCache.get(crateDownDataId)),
    })
    const wSounds = {
        snap: soundSprite.create("w_snap"),
        crack: soundSprite.create("w_crack")
    }
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
        wind: windPool.create.bind(windPool),
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
        sb4: (x, y, props, player) => {
            return new SawBlade(x, y,  "sb4", props.toX, props.toY, props.speed, player)
        },
        sb5: (x, y, props, player) => {
            return new SawBlade(x, y,  "sb5", props.toX, props.toY, props.speed, player)
        },
        lcr1: (x, y, props, player) => {
            return new Crate(x, y, crateParticles, orbPool, wSounds, props.luck, props.dmg, props.temp, player)
        }
    })
}