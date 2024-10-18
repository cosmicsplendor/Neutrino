const { skewedRand, pickOne, rand, CompositeBlock, Block, decomposeBlocks, weightedRand } = require("../../utils")
const groupMap = require("../../utils/groupMap.json")
const { generateTiles, generateTileSpawnPoints } = require("../generateTiles")
const TILE_SIZE = 48
const STACK_TOP = ["top-start", "top-end", "top"]
const STACK_LEFT = ["left-start", "left-end", "left"]
const STACK_RIGHT = ["right-start", "right-end", "right"]

const sawBlades = (nameMap) => {
    return {
        fields: ['toX', 'toY', 'speed', "size"], // Based on SawBlade constructor
        dims: (params, atlas) => {
            const { width, height } = atlas[nameMap[params.size]]
            return { width, height }
        },
        create: (params) => {
            const { x, y, toX, toY, speed, size } = params
            return {
                // these should come in relative grid space
                x, y,
                toX: x + Number(toX) * TILE_SIZE,
                toY: y + Number(toY) * TILE_SIZE,
                name: nameMap[size],
                speed: +speed
            }
        }
    }
}

const lasers = ({static=false, horizontal=true}) => {
    const basicFields = ["num", "period", "delay"]
    if (!static) {
        basicFields.push('speed')
    }
    if (horizontal) {
        basicFields.push("toY")
    } else {
        basicFields.push("toX")
    }
    return {
        fields: fields,
        create: (params) => {
            const { x, y, toX, toY, speed, num, period, delay, name } = params
            return {
                x, y,
                toX: x + Number(toX) * TILE_SIZE, toY: y + Number(toY) * TILE_SIZE,
                name: name, delay: +delay, period: +period, speed: +speed, num: +num
            }
        }
    }
}

const saws = (data = { name: "saw2", field: "width", dims: { width: 0, height: 0 }, xOffset: 0 }) => {
    const dims = data.dims ?? (data.field === "width" ? { width: 72, height: 24 } : { width: 24, height: 72 })
    const xOffset = data.xOffset ?? 0
    return {
        fields: [data.field],
        dims: ({ width: w = 1, height: h = 1 }) => {
            return {
                width: w * dims.width,
                height: h * dims.height
            }
        },
        create(params) {
            const { x, y, width, height } = params
            if (data.field === "height") {
                return Array(+height).fill(0).map((_, i) => {
                    return { x: x, y: y + (i * dims.height), name: data.name }
                })
            }
            return Array(+width).fill(0).map((_, i) => {
                return { x: x + (i + 1) * xOffset + i * dims.width, y: y, name: data.name }
            })
        }
    }
}

const stackables = ({ name, dims }) => {
    return {
        randomize: true,
        fields: ["width", "height", "density"],
        dims: ({ width, height }) => {
            return {
                width: width * dims.width,
                height: height * dims.height
            }
        },
        createHorizontal(width, height, density) {
            const parent = new CompositeBlock(new Block(width, 1))
            let prevWidth = width
            for (let i = 1; i < height; i++) {
                const newWidth = weightedRand(0, prevWidth, density)
                prevWidth = newWidth
                parent.addPart({
                    width: newWidth, height: 1, position: pickOne(STACK_TOP), onto: "last"
                })
            }
            return parent
        },
        createVertical(width, height, density) {
            const parent = new CompositeBlock(new Block(1, height))
            let prevHeight = height
            for (let i = 1; i < width; i++) {
                const newHeight = weightedRand(0, prevHeight, density)
                parent.addPart({
                    width: 1, height: newHeight, position: "right-end", onto: "last"
                })
            }
            return parent
        },
        createBlocks(x, y, width, height, density) {
            const vertical = rand(1, 0)
            console.log(vertical ? "Vertical": "Horizontal")
            const block = vertical ? this.createVertical(width, height, density): this.createHorizontal(width, height, density)
            return block.children.flatMap(decomposeBlocks).map(b => {
                const dy = vertical ? 0: +height - 1
                return { x: x + b.x * dims.width, y: y + (b.y + dy) * dims.height, name: typeof name === "function" ? name(): name }
            })
        },
        create(params) {
            const { x, y, width, height, density } = params
            return this.createBlocks(x, y, width, height, density)
        }
    }
}

const factories = {
    player: {
        fields: [], // No specific props inferred from the original code
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
    gearBlade: sawBlades({ small: "sb2", large: "sb6" }),
    spikeBlade: sawBlades({ small: "sb3", large: "sb5" }),
    buttonBlade: sawBlades({ small: "sb1", large: "sb4" }),
    lcr1: {
        fields: ['luck', 'dmg'], // Based on Crate constructor
        create: (params) => {
            const { luck, dmg, name, x, y, alignment } = params
            return { luck: +luck, dmg: +dmg, name, x: x, y: y + (alignment === "top-left" ? 32 : 0), groupId: "crates" }
        }
    },
    vlhd: lasers({ static: false, horizontal: false}),
    vlhdStatic: lasers({ static: true }),
    hlhd: lasers({ static: false, horizontal: true}),
    hlhdStatic: lasers({ static: true }),
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
    pillar: {
        fields: ["height"],
        dims({ height }) {
            return {
                width: 40, height: 128 * height
            }
        },
        create(params) {
            const { x, y, height } = params
            return Array(+height).fill(0).map((_, i) => {
                return { x: x, y: y + (i * 128), name: "pillar" }
            })
        }
    },
    topSaw: saws({ name: "saw1", field: "width" }),
    bottomSaw: saws({ name: "saw2", field: "width" }),
    spike: saws({ name: "spike", field: "width", dims: { width: 80, height: 40 }, xOffset: 8 }),
    leftSaw: saws({ name: "saw4", field: "height" }),
    rightSaw: saws({ name: "saw3", field: "height" }),
    bridge: {
        fields: ["width"],
        dims({ width = 1 }) {
            return {
                width: (240 + 16) * width + 16, height: 104
            }
        },
        create(params) {
            const { x, y, width } = params
            const results = Array(+width).fill(width).map((_, i) => {
                const iX = x + i * 240
                return [
                    { name: "br1", x: iX + (i + 1) * 10, y: y + 10 },
                    { name: "br2", x: iX + i * 10, y: y }
                ]
            }).flat()
            results.push({
                x: x + (240 + 10) * width,
                y: y,
                name: "br2"
            })
            results.colRects = [{
                x: x, y: y + 10, h: 24, mat: "wood", w: 256 * width + 10
            }]
            return results
        }
    },
    gate: {
        block: null,
        extendedLeft: false,
        randomize: true,
        reset() {
            this.extendedLeft = false
            this.block = new CompositeBlock(new Block(5, 4))
        },
        extendLeft() {
            const skip = rand(1, 0)
            if (skip) return
            this.extendedLeft = true
            const num = rand(4, 2)
            const block = new Block(1, num)
            const position = "left-end"
            this.block.addPart({ block, position })
        },
        extendRight() {
            const skip = rand(1, 0)
            if (skip) return
            const num = rand(4, 2)
            const block = new Block(1, num)
            const position = "right-end"
            this.block.addPart({ block, position })
        },
        extendTop() {
            const skip = rand(1, 0)
            if (skip) return
            const num = rand(5, 2)
            const block = new Block(num, 1)
            const position = pickOne(num % 2 === 0 ? STACK_TOP.slice(-1) : STACK_TOP)
            this.block.addPart({ block, position })
        },
        extend() {
            this.extendLeft()
            this.extendRight()
            this.extendTop()
        },
        dims() {
            this.reset()
            this.extend()
            const { block } = this
            return { width: block.w * TILE_SIZE, height: (block.h + 3) * TILE_SIZE }
        },
        create(params) {
            const { x: originX, y: originY } = params
            const { block } = this
            const dx = this.extendedLeft ? 1 : 0
            const dy = block.h - 4
            const gateY = originY + (TILE_SIZE * block.h) - 56
            const gate = { y: gateY, x: originX + (dx + 2.5) * TILE_SIZE - 56, name: "gate", endY: gateY - 128 }
            const tileReplacer = (row, col, cell) => {
                const archY = dy + 2
                const archX = dx + 1
                if (row == archY && col == archX) {
                    return "garch"
                }
                if (row == archY && (col == archX + 1 || col == archX + 2)) {
                    return "empty"
                }
                if (row === archY + 1 && col >= archX && col < archX + 3) {
                    return "empty"
                }
                return cell
            }
            const tiles = generateTileSpawnPoints(block, TILE_SIZE, TILE_SIZE, originX, originY, tileReplacer)
            const results = [ gate, ...tiles ]
            results.colRects = block.collisionRects.map(({ x, y, w, h }) => {
                return { x: (x + dx) * TILE_SIZE + originX, y: (y + dy) * TILE_SIZE + originY, w: w * TILE_SIZE, h: h * TILE_SIZE}
            })
            return results
        }
    },
    crate: stackables({ name: "crate", dims: { width: 88, height: 88 }}),
    tyre: stackables({ name: "tyre", dims: { width: 104, height: 32 } }),
    sc: stackables({ name: () => pickOne([ "sc_blue", "sc_red", "sc_green" ]), dims: { width: 120, height: 120 }})
}

module.exports = factories