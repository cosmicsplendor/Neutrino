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
import levels from "@config/levels"

import fireDataId from "@assets/particles/fire.cson"
import orbDataId from "@assets/particles/orb.cson"
import crateUpDataId from "@assets/particles/crate-up.cson"
import crateDownDataId from "@assets/particles/crate-down.cson"
import windDataId from "@assets/particles/wind.cson"


const resettable = factory => (x, y, props={}, player) => { // returns a new factory same as the input, except that it's instances have reset method 
    const ent = factory(x, y, props, player)
    ent.reset = !!ent.reset ? ent.reset : () => {
        ent.pos.x = x
        ent.pos.y = y
    }
    return ent
}

export default ({ soundSprite, assetsCache, storage, player, state }) => { // using sound sprite to create and pass objects and (cached) pools so that objects can just consume sound in ready-to-use form rather than by creating them on their own. This helps me make sound creation parameters changes at one place, making code more scalable.
    const gateUSound = soundSprite.create("gate_u") // collision with ceiling
    const gateDSound = soundSprite.create("gate_d")
    const orbMovSound = soundSprite.create("orb_mov")
    const orbSound = soundSprite.createPool("orb")
    const endSound = soundSprite.create("end")
    
    const createOrbPool = (temp, size, orbSound, orbMovSound, storage, orbDataId) => {
        const orbFac = (x, y, props, player) => { // factory for creating orbs at orb spawn points in the map
            return new Orb(Object.assign(
                assetsCache.get(orbDataId),
                { player, pos: { x, y }, sound: orbSound, movSound: orbMovSound, storage, temp },
            ))
        }
        const orbPool = new Pool({
            factory: orbFac,
            size,
            free(obj) {
                obj.remove() // remove the object from it's parent
            },
            reset(obj, x, y) {
                obj.pos.x = x
                obj.pos.y = y
            }
        })
        return orbPool
    }
    const orbPool = createOrbPool(false, 2, orbSound, orbMovSound, storage, orbDataId)
    const tempOrbPool = createOrbPool(true, 2, orbSound, orbMovSound, storage, orbDataId)
    const windPool = new Pool({
        factory: (x, y, props, player) => {
            return new Wind(
                assetsCache.get(windDataId),
                x, y, player
            )
        },
        size: 1,
        free(obj) {
            obj.remove()
        },
        reset(obj, x, y) {
            obj.pos.x = x
            obj.pos.y = y - 10
        }
    })

    const onFireTouch = () => {
        const bestTime = storage.getHiscore(state.level) || 0
        const curTime = state.elapsed
        if (state.level === storage.getCurLevel() && state.level < levels.length) {
            storage.setCurLevel(state.level + 1)
        }
        if (bestTime === 0 || curTime < bestTime) {
            storage.setHiscore(state.level, curTime)
        }
        endSound.play()
        state.complete(curTime, bestTime)
    }
    const fire = new Fire(assetsCache.get(fireDataId), onFireTouch)
    const crateParticles = Object.freeze({
        up: new ParticleEmitter(assetsCache.get(crateUpDataId)),
        down: new ParticleEmitter(assetsCache.get(crateDownDataId)),
    })
    const wSounds = { // wood sounds
        snap: soundSprite.create("w_snap"),
        crack: soundSprite.create("w_crack")
    }
    const playerFac = (x, y) => {
        player.reset = () => {
            player.pos.x = x
            player.pos.y = y
            player.alpha = 1
            player.velY = player.velX = 0
        }
        player.reset()
        return player
    }
    return ({
        player: resettable(playerFac),
        gate: (x, y, props, player) => {
            return new Gate({
                pos: { x, y },
                colSound: null,
                uSound: gateUSound,
                dSound: gateDSound,
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
            return new Crate(x, y, crateParticles, tempOrbPool, wSounds, props.luck, props.dmg, props.temp, player)
        }
    })
}