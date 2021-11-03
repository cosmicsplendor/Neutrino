import ParticleEmitter from "@lib/utils/ParticleEmitter"
import Orb from "@entities/Orb"
import Gate from "@entities/Gate"
import Wind from "@entities/Wind"
import Magnet from "@entities/Magnet"
import Ball from "@entities/Ball"
import SawBlade from "@entities/SawBlade"
import Laser from "@entities/Laser"
import Fire from "@entities/Fire"
import Crate from "@entities/Crate"
import WaterSurf from "@entities/WaterSurf"
import Pool from "@utils/Pool"
import levels from "@config/levels"

import particlesId from "@assets/particles/all.cson"

export default ({ soundSprite, assetsCache, storage, player, state }) => { // using sound sprite to create and pass objects and (cached) pools so that objects can just consume sound in ready-to-use form rather than by creating them on their own. This helps me make sound creation parameters changes at one place, making code more scalable.
    const gateUSound = soundSprite.create("gate_u") // collision with ceiling
    const gateDSound = soundSprite.create("gate_d")
    const orbSound = soundSprite.createPool("orb")
    const endSound = soundSprite.create("end")
    const lasSounds = {
        on: soundSprite.createPool("las_on"),
        off: soundSprite.createPool("las_off")
    }
    
    const particles = assetsCache.get(particlesId)
    const createOrbPool = (temp, size, orbSound, storage) => {
        const orbFac = (x, y, props, player) => { // factory for creating orbs at orb spawn points in the map
            return new Orb(Object.assign(
                { },
                particles.orb,
                { player, pos: { x, y }, sound: orbSound, storage, temp },
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
    const orbPool = createOrbPool(false, 2, orbSound, storage)
    const tempOrbPool = createOrbPool(true, 2, orbSound, storage)
    const windPool = new Pool({
        factory: (x, y, props, player) => {
            return new Wind(
                particles.wind,
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
    const fire = new Fire(particles.fire, onFireTouch)
    const crateDmgFacs = Object.freeze({
        up: new Pool({
            factory: () => {
                const particle = new ParticleEmitter(particles.crateUp)
                particle.onRemove = () => { // clear reference for garbage collector
                    particle.parent = null
                }
                return particle
            },
            size: 2
        }),
        down: new Pool({
            factory: () => {
                const particle = new ParticleEmitter(particles.crateDown)
                particle.onRemove = () => { // clear reference for garbage collector
                    particle.parent = null
                }
                return particle
            },
            size: 2
        }),
    })
    const wSounds = { // wood sounds
        snap: soundSprite.createPool("w_snap"),
        crack: soundSprite.createPool("w_crack")
    }
    const playerFac = (x, y) => {
        player.reset = () => {
            player.pos.x = x
            player.pos.y = y
            player.alpha = 1
            player.velY = player.velX = 0
            player.controls.switchState("jumping", player, true) // revert to jumping state
        }
        player.reset()
        return player
    }
    return ({
        player: playerFac,
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
            return new Crate(x, y, crateDmgFacs, tempOrbPool, wSounds, props.luck, props.dmg, props.temp, player)
        },
        vlhd: (x, y, props, player) => {
            return new Laser(x, y, props.toX, props.toY, props.speed, props.num, true, props.period, props.on, player, lasSounds)
        },
        hlhd: (x, y, props, player) => {
            return new Laser(x, y, props.toX, props.toY, props.speed, props.num, false, props.period, props.on, player, lasSounds)
        },
        surf: (x, y, props) => {
            return new WaterSurf({ pos: { x, y }, numEl: props.numEl })
        }
    })
}