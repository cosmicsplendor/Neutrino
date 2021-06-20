import { Node } from "@lib"
import TexRegion from "@lib/entities/TexRegion"
import { rand, randf, pickOne } from "@utils/math"
import Movement from "@components/Movement"

class Particle extends TexRegion {
    constructor({ imgId, metaId, frame, pos, lifetime, velX, velY, accX, accY, alpha, alphaEasingFn, loop }) {
        super({ imgId, metaId, frame, pos })
        this.lifetime = lifetime
        this.velX0 = velX
        this.velY0 = velY
        this.alpha0 = alpha
        this.pos0 = { ...pos }
        this.alpha = alpha
        this.alphaEasingFn = alphaEasingFn
        this.elapsed = 0
        this.loop = loop
        Movement.makeMovable(this, { velX, velY, accX, accY })
    }
    reset() {
        this.elapsed = 0
        this.velX = this.velX0
        this.velY = this.velY0
        this.alpha = this.alpha0
        this.pos.x = this.pos0.x
        this.pos.y = this.pos0.y
    }
    update(dt) {
        this.elapsed += dt
        // Math.random() < 0.1 && console.log(this.elapsed > this.lifetime)
        if (this.elapsed > this.lifetime && this.loop) {
            this.reset()
        }
        Movement.update(this, dt)
        if (this.alphaEasingFn) {
            this.alpha = this.alphaEasingFn(this.elapsed / this.lifetime)
        }
    }
}

/**
 * const types = [
 *     { frame, offsetX = 0, offsetY = 0, lifetime: [ 2, 5 ], velX, velY, accX, accY, alpha, alphaEasingFn, weight = 1 },
 *     { frame, offsetX = 0, offsetY = 0, lifetime: [ 4, 8 ], velX, velY, accX, accY, alpha, alphaEasingFn, weight = 1 },
 * ]
 */

class ParticleEmitter extends Node {
    constructor({ size, blendMode, loop = false, randomDistribution = true, metaId, imgId, params, ...nodeProps }) {
        super({ ...nodeProps })
        this.blendMode = blendMode
        let paramIndices
        if (randomDistribution) {
            paramIndices = params.reduce((distribution, param, index) => {
                return distribution.concat(Array(param.weight || 1).fill(index))
            },[])
        } else {
            const sumOfWeights = params.reduce((prevTotal, param) => {
                return prevTotal + (param.weight || 1)
            }, 0)
            paramIndices = params.reduce((prevIndices, param, index) => {
                return prevIndices.concat(Array(Math.round(size * (param.weight || 1) / sumOfWeights)).fill(index))
            }, [])
        }
        for (let i = 0; i < size; i++) {
            const index = randomDistribution ? pickOne(paramIndices): paramIndices[i]
            const param = params[index]
            const deserializedParam = {
                metaId,
                imgId,
                frame: param.frame,
                pos: {
                    x: Array.isArray(param.offsetX) ? rand(param.offsetX[0], param.offsetX[1]): param.offsetX || 0,
                    y: Array.isArray(param.offsetY) ? rand(param.offsetY[0], param.offsetY[1]): param.offsetY || 0,
                },
                lifetime: Array.isArray(param.lifetime) ? randf(param.lifetime[0], param.lifetime[1]): param.lifetime,
                velX: Array.isArray(param.velX) ? rand(param.velX[0], param.velX[1]): param.velX,
                velY: Array.isArray(param.velY) ? rand(param.velY[0], param.velY[1]): param.velY,
                accX: Array.isArray(param.accX) ? rand(param.accX[0], param.accX[1]): param.accX,
                accY: Array.isArray(param.accY) ? rand(param.accY[0], param.accY[1]): param.accY,
                alpha: Array.isArray(param.alpha) ? rand(param.alpha[0], param.alpha[1]): param.alpha,
                alphaEasingFn: param.alphaEasingFn,
                loop
            }
            this.add(new Particle(deserializedParam))
        }
    }
}

export default ParticleEmitter