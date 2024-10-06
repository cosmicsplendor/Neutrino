const { pickOne } = require("@lib/utils/math")
const { skewedRand, pickOne, rand, CompositeBlock, Block, decomposeBlocks } = require("../../utils")
const groupMap = require("../../utils/groupMap.json")
const TILE_SIZE = 48
const STACK_TOP = [ "top-start", "top-end", "top"]
const STACK_LEFT = [ "left-start", "left-end", "left"]
const STACK_RIGHT = [ "right-start", "right-end", "right"]
const sawBlades = () => {
    return {
        fields: ['toX', 'toY', 'speed'], // Based on SawBlade constructor
        create: (params) => {
            const { x, y, toX, toY, speed, name } = params
            return {
                // these should come in relative grid space
                x, y,
                toX: x + Number(toX) * TILE_SIZE,
                toY: y + Number(toY) * TILE_SIZE,
                name: name,
                speed: +speed
            }
        }
    }
}
const lasers = () => {
    return {
        fields: ['toX', 'toY', 'speed', 'num', 'period', 'delay', 'on'], // Inferred from Laser constructor
        create: (params) => {
            const { x, y, toX, toY, speed, num, period, delay, on, name } = params
            return {
                x, y,
                toX: x + Number(toX) * TILE_SIZE, toY: y + Number(toY) * TILE_SIZE,
                name: name, on: Boolean(on),
                delay: +delay, period: +period, speed: +speed, num: +num
            }
        }
    }
}
const factories = Object.freeze({
    player: {
        fields: [], // No specific props inferred from the original code
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    gate: {
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    checkpoint: {
        create: (params) => {
            return params
        }
    },
    orb: {
        fields: [], // No specific props required
        create: (params) => {
            return params
        }
    },
    wind: {
        fields: [], // No specific props required
        create: (params) => {
            return params
        }
    },
    fire: {
        fields: [], // Based on player usage
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    ball: {
        fields: ['seq',], // Inferred from Ball constructor and props.seq
        create: (params) => {
            // Perform transformation
            return params
        }
    },
    sb1: sawBlades(),
    sb2: sawBlades(),
    sb3: sawBlades(),
    sb4: sawBlades(),
    sb5: sawBlades(),
    sb6: sawBlades(),
    lcr1: {
        fields: ['luck', 'dmg'], // Based on Crate constructor
        create: (params) => {
            const { luck, dmg, name, x, y, alignment } = params
            return { luck: +luck, dmg: +dmg, name, x: x, y: y + (alignment === "top-left" ? 32 : 0), groupId: "crates" }
        }
    },
    vlhd: lasers(),
    hlhd: lasers(),
    crane: {
        create: params => {
            const { alignment, x, y, name } = params
            return { x, y: y + (alignment.includes("top") ? 32 : 0), name }
        }
    },
    bus: {
        fields: ['toY', 'period'], // Based on Bus constructor
        dims: () => ({ width: 88, height: 88 }),
        create: (params) => {
            const { toY, x, y, name, period, alignment } = params
            return { groupId: "col-rects", x, y: y + (alignment.startsWith("top") ? 32 : 0), name, toY: y + Number(toY) * TILE_SIZE, period: +period }
        }
    },
    magnet: {
        dims: () => {
            return {
                width: 128 + 16 * 2, // magnet width + twice stud width
                height: 32
            }
        },
        create: (params) => {
            const { x, y } = params
            return [
                { name: "magnet", x: x + 16, y, groupId: "magnets" },
                { name: "stud", x, y },
                { name: "stud", x: x + 128 + 16, y }
            ]
        }
    },
    default: {
        fields: [],
        create: params => {
            const groupId = groupMap[params.name]
            if (groupId) params.groupId = groupId
            return params
        }
    },
    wind: {
        dims: () => {
            return { width: 80, height: 32 }
        },
        possible(projection, alignment) {
            if (alignment !== "top" && alignment !== "bottom") return false // only possible alignments
            if (projection.w % 2 === 0 || projection.w === 1) return false // only possible for odd tile count greater than 1
            return true
        },
        create: params => {
            const { x, y } = params
            return [
                { x, y, name: "em1" },
                { x: x + 40, y, name: "wind", collapsed: [{ y: y + 32, x: x + 16 }] }
            ]
        }
    },
    gate: {
        block: null,
        clear() {
            this.block = new CompositeBlock(new Block(5, 3))
        },
        extendLeft() {
            const skip = rand(1, 0)
            if (skip) return
            const num = rand(3, 2)
            const block = new Block(1, num)
            const position = "left-end"
            this.block.addPart({ block, position })
        },
        extendRight() {
            const skip = rand(1, 0)
            if (skip) return
            const block = new Block(1, num)
            const position = "right-end"
            this.block.addPart({ block, position })
        },
        extendTop() {
            const skip = rand(1, 0)
            if (skip) return
            const num = rand(5, 2)
            const block = new Block(num, 1)
            const position = pickOne(num % 2 === 0 ? STACK_TOP.slice(-1): STACK_TOP)
            this.block.addPart({ block, position })
        },
        extend() {
            this.extendLeft()
            this.extendRight()
            this.extendTop()
        },
        dims() {
            this.clear()
            this.extend()
            const { block } = this
            return { width: block.w * TILE_SIZE, height: block.h * TILE_SIZE }
        },
        create: params => {
            const { x: originX, y: originY } = params
            const blocks = this.block.children.map(decomposeBlocks).flatMap(b => {
                return { x: originX + b.x * TILE_SIZE, y: originY + b.y * TILE_SIZE, name: "wt_1" }
            })
            return blocks
        }
    }
})

module.exports = factories