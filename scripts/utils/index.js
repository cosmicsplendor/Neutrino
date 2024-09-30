const fs = require("fs/promises")
const atlasPath = "../../src/assets/images/atlasmeta.cson"

const getAtlas = async () => {
    const buffer = await fs.readFile(atlasPath)
    const data = JSON.parse(buffer.toString("utf-8"))
    const entries = Object.entries(data)
    entries.forEach(e => {
        if (!e[1].rotation) return
        const { width, height } = e[1]
        e[1].width = height
        e[1].height = width
    })
    return Object.fromEntries(entries)
}

function mergeRects(rects) {
    if (rects.length === 0) return []

    rects.sort((a, b) => a.y - b.y || a.x - b.x)

    const mergedHorizontally = []
    let current = rects[0]

    for (let i = 1; i < rects.length; i++) {
        const next = rects[i]

        if (current.y === next.y && current.h === next.h &&
            current.x + current.w === next.x) {
            current.w = current.w + next.w
        } else {
            mergedHorizontally.push({ ...current })
            current = next
        }
    }

    mergedHorizontally.push({ ...current })

    const mergedVertically = []
    mergedHorizontally.sort((a, b) => a.x - b.x || a.y - b.y)

    current = mergedHorizontally[0]

    for (let i = 1; i < mergedHorizontally.length; i++) {
        const next = mergedHorizontally[i]

        if (current.x === next.x && current.w === next.w &&
            current.y + current.h >= next.y) {
            current.h = Math.max(current.y + current.h, next.y + next.h) - current.y
        } else {
            mergedVertically.push({ ...current })
            current = next
        }
    }

    mergedVertically.push({ ...current })

    return mergedVertically
}

const sc = { // stack calcs
    il: c => { // inside-left
        return c.x
    },
    ol: (c, e) => { // outside-left
        return c.x - e.w
    },
    ir: (c, e) => { // inside-right
        return c.x + (c.w - e.w)
    },
    or: c => { // outiside-right
        return c.x + c.w
    },
    hc: (c, e) => { // horizontal center
        return c.x + (c.w - e.w) / 2
    },
    it: c => { // inside-top
        // c --> container bounds; e --> entity bounds
        return c.y
    },
    ot: (c, e) => { // outside-top
        return c.y - e.h
    },
    ib: (c, e) => { // inside-bottom
        return c.y + (c.h - e.h)
    },
    ob: c => { // outiside-bottom
        return c.y + c.h
    },
    vc: (c, e) => { // vertical center
        return c.y + (c.h - e.h) / 2
    }
}

function calcAligned(c, e, x, y, mX = 0, mY = 0) {
    const pos = { x: mX, y: mY }
    switch (x) {
        case "left":
            pos.x += sc.il(c, e)
            break
        case "center":
            pos.x += sc.hc(c, e)
            break
        case "right":
            pos.x += sc.ir(c, e)
            break
        default:
            throw new Error(`Invalid x-alignment parameter: ${x}`)
    }
    switch (y) {
        case "top":
            pos.y += sc.it(c, e)
            break
        case "center":
            pos.y += sc.vc(c, e)
            break
        case "bottom":
            pos.y += sc.ib(c, e)
            break
        default:
            throw new Error(`Invalid y-alignment parameter: ${y}`)
    }
    return Object.assign(e, pos)
}

function calcStacked(b1, b2, dir, mX = 0, mY = 0) {
    const pos = { x: mX, y: mY }
    switch (dir) {
        case "top-start":
            pos.x += sc.il(b1, b2)
            pos.y += sc.ot(b1, b2)
            break
        case "top":
            pos.x += sc.hc(b1, b2)
            pos.y += sc.ot(b1, b2)
            break
        case "top-end":
            pos.x += sc.ir(b1, b2)
            pos.y += sc.ot(b1, b2)
            break
        case "right-start":
            pos.x += sc.or(b1, b2)
            pos.y += sc.it(b1, b2)
            break
        case "right":
            pos.x += sc.or(b1, b2)
            pos.y += sc.vc(b1, b2)
            break
        case "right-end":
            pos.x += sc.or(b1, b2)
            pos.y += sc.ib(b1, b2)
            break
        case "bottom-start":
            pos.x += sc.il(b1, b2)
            pos.y += sc.ob(b1, b2)
            break
        case "bottom":
            pos.x += sc.hc(b1, b2)
            pos.y += sc.ob(b1, b2)
            break
        case "bottom-end":
            pos.x += sc.ir(b1, b2)
            pos.y += sc.ob(b1, b2)
            break
        case "left-start":
            pos.x += sc.ol(b1, b2)
            pos.y += sc.it(b1, b2)
            break
        case "left":
            pos.x += sc.ol(b1, b2)
            pos.y += sc.vc(b1, b2)
            break
        case "left-end":
            pos.x += sc.ol(b1, b2)
            pos.y += sc.ib(b1, b2)
            break
        default:
            throw new Error(`Invalid stacking direction: ${dir}`)
    }
    pos.x = Math.round(pos.x)
    pos.y = Math.round(pos.y)
    return pos
}

const combine = (a, b, dir) => {
    switch (dir) {
        case "x":
            return {
                w: a.w + b.w,
                h: Math.max(a.h, b.h)
            }
        case "y":
            return {
                w: Math.max(a.w, b.w),
                h: Math.max(a.h, b.h)
            }
        default:
            throw new Error(`Invalid combine direction: ${dir}`)
    }
}


const calcComposite = entities => { // compute a rect that contains all the entities
    const composite = {...entities[0]}
    for (let i = 1; i < entities.length; i++) {
        const ent = entities[i]
        const rEdgX = Math.max(composite.x + composite.w, ent.x + ent.w)
        const bEdgY = Math.max(composite.y + composite.h, ent.y + ent.h)

        composite.x = Math.min(composite.x, ent.x)
        composite.y = Math.min(composite.y, ent.y)
        composite.w = rEdgX - composite.x
        composite.h = bEdgY - composite.y
    }
    return composite
}


class Block {
    x = 0
    y = 0
    static new(w, h) {
        return new this(w, h)
    }
    constructor(w, h) {
        this.w = w
        this.h = h
    }
}

class CompositeBlock extends Block {
    collisionRects = []
    children = []
    static _map = null
    static registerMap(map) {
        this._map = map
    }
    static create(blockOrConfig) {
        const initialBlock = blockOrConfig instanceof Block || blockOrConfig instanceof CompositeBlock? blockOrConfig: new Block(blockOrConfig.width, blockOrConfig.height) 
        return new CompositeBlock(initialBlock)
    }
    constructor(initialBlock) {
        super(0, 0)
        this.addPart({ block: initialBlock})
    }
    addPart({block: _block, width, height, position, onto = "parent", dx, dy}) {
        const block = typeof width === "number" && typeof height === "number" ? new Block(width, height): _block
        const stackAgainst = onto === "parent" ? this: (onto === "last" ? this.last: undefined)
        if (stackAgainst === undefined) throw new Error(`Invalid onto param: ${onto}`)
        if (this.children.length === 0) { // initial child
            this.children.push(block);
            Object.assign(this, block);
        } else {
            Object.assign(block, calcStacked(stackAgainst, block, position, dx, dy));
            this.children.push(block);
            Object.assign(this, calcComposite(this.children));
        }
    
        this.last = block;
        this.collisionRects.push({ ...block });
        this.collisionRects = mergeRects(this.collisionRects);
        
        return this;
    }
    
    stackOn(block, {position, dx, dy}) { // stack itself onto sth
        const { x, y } = calcStacked(block, this, position, dx, dy)
        const xShift = x - this.x
        const yShift = y - this.y

        this.x = x
        this.y = y

        return this.shift(xShift, yShift)
    }
    shift(dx, dy=0) {
        this.children.forEach(block => {
            block.x += dx
            block.y += dy
        })

        this.collisionRects.forEach(rect => {
            rect.x += dx
            rect.y += dy
        })
        return this
    }
    addToMap({ collision, layer }={collision: false, layer: "fg"}) {
        CompositeBlock._map.addBlock({ block: this, skipCollisionTest: collision, layer })
        return this
    }
}

class Map extends Block {
    tileW=48
    collisionRects = []
    spawnPoints= [
        { name: "player", x: 0, y: 0 }
    ]
    checkpoints = []
    layers = {
        fg: [],
        og: [],
        mg: []
    }
    bg = "#132b27"
    mob_bg = "#132b27"
    pxbg = "#0a1614"
    tint = "0.025, -0.025, -0.0125, 0"
    constructor({width, height, ...config}={}) {
        super(width, height)
        Object.assign(this, config)
        this.clear()
        CompositeBlock.registerMap(this)
    }
    clear() {
        this.layers.fg.length= 0
        this.layers.og.length= 0
        this.layers.mg.length= 0
        this.collisionRects.length = 0
        this.floor = calcAligned(this, new Block(this.w, this.floorHeight ?? 4), "left", "bottom")
        this.addBlock({ block: this.floor, layer: "fg" })
    }
    addPlainBlock({block, layer = "og", skipCollisionTest = false}) {
        const x = Math.round(block.x)
        const y = Math.round(block.y)
        for (let i = 0; i < block.h; i++) {
            for (let j = 0; j < block.w; j++) {
                this.layers[layer].push({ x: x + j, y: y + i, w: 1, h: 1 })
            }
        }
        this.collisionRects.push({ x: block.x, y: block.y, w: block.w, h: block.h })
    }
    addCompositeBlock({block, layer = "fg", skipCollisionTest}) {
        if (!(block instanceof CompositeBlock)) return
        for (const child of block.children) {
            this.addPlainBlock({ block: child, layer, skipCollisionTest: true})
        }
        if (skipCollisionTest) return
        // add collision rects
        for (const rect of block.collisionRects) {
            this.collisionRects.push({...rect})
        }
        this.collisionRects = mergeRects(this.collisionRects)

        // later implement spawn point and checkpoint logic
    }
    addBlock(params) {
        if (params.block instanceof CompositeBlock) {
            this.addCompositeBlock(params)
            return
        }
        if (params.block instanceof Block) {
            this.addPlainBlock(params)
            return
        }
        throw new Error("Invalid block:", params)
    }
    getGrid(layer) {
        const { w, h, layers } = this;
        const grid = Array.from({ length: h }, () => Array(w).fill(' '));

        for (const cell of layers[layer]) {
            const { x, y } = cell;
            if (x >= 0 && x < w && y >= 0 && y < h) {
                grid[y][x] = '$';
            }
        }
        return grid
    }
    printAscii(layer = "fg") {
        const grid = getGrid(layer)
        console.log(grid.map(row => row.join('')).join('\n'));
    }
    printAsciiScaled(layer = "fg") {
        const { w, h, layers } = this;
        // Double the width of the grid
        const grid = Array.from({ length: h }, () => Array(w * 2).fill(' '));
    
        for (const cell of layers[layer]) {
            const { x, y } = cell;
            if (x >= 0 && x < w && y >= 0 && y < h) {
                // Double the x-coordinate for display
                const doubleX = x * 2;
                grid[y][doubleX] = '$';
                grid[y][doubleX + 1] = '$'; // Fill the adjacent cell to the right
            }
        }
    
        console.log(grid.map(row => row.join('')).join('\n'));
    }
    async exportMap(levelName) {
        const { tileW, bg, mob_bg, pxbg, tint } = this
        const [ fgTiles, tiles, mgTiles ] = Object.values(this.layers).map(layer => {
            return layer.map(tile => {
                const { name="wt_1", x, y } = tile
                return { name, x: x * tileW, y: y * tileW } 
            })
        })
        const collisionRects = this.collisionRects.map(rect => {
            const { x, y, w, h, mat } = rect
            return { x: x * tileW, y: y * tileW, width: w * tileW, height: h * tileW, mat }
        })
        const spawnPoints = this.spawnPoints.map(point => {
            const { x, y, ...rest } = point
            return { x: x * tileW, y: y * tileW, ...rest}
        })
        const checkPoints = this.checkpoints.map(point => {
            return {
                x: point.x * tileW,
                y: point.y * tileW
            }
        })
        const exports = { collisionRects, spawnPoints, checkPoints, fgTiles, tiles, mgTiles, bg, mob_bg, pxbg, tint, width: this.w * tileW, height: this.h * tileW }
        await fs.writeFile(`./src/assets/levels/${levelName}.cson`, JSON.stringify(exports))
    }
}
const generateGrid = (rects) => {
    const compositeRect = calcComposite(rects)
    const grid = Array(compositeRect.w * compositeRect.h).fill(0)
    rects.forEach(rect => {
        const x = rect.x - compositeRect.x
        const y = rect.y - compositeRect.y
        for (let i = x; i < x + rect.w; i++) {
            for (let j = y; j < y + rect.h; j++) {
                const index = compositeRect.w * j + i
                grid[index] = 1
            }
        }
    })
    return Object.assign({
        grid,
        get(i, j) {
            return grid[compositeRect.w * j + i]
        }
    }, compositeRect)
}

module.exports  = {
    combine,
    calcComposite,
    calcAligned,
    Block,
    CompositeBlock,
    Map,
    generateGrid
}