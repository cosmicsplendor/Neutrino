const fs = require("fs/promises")
const atlasPath = "./src/assets/images/atlasmeta.cson"

const collisionMatMap = {
    "sc_red": "metal",
    "sc_green": "metal",
    "sc_blue": "metal",
}

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
    return { ...e, ...pos }
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
    constructor(w, h) {
        this.w = w
        this.h = h
    }
}

class CompositeBlock extends Block {
    collisionRects = []
    children = []
    constructor(initialBlock) {
        super(0, 0)
        this.add(initialBlock)
    }
    add(block, stackDir, offsetX, offsetY, stackAgainst=this.last) {
        if (this.children.length === 0) { // initial child
            this.children.push(block)
            Object.assign(this, block)
        } else {
            Object.assign(block, calcStacked(stackAgainst, block, stackDir, offsetX, offsetY))
            this.children.push(block)
            Object.assign(this, calcComposite(this.children))
        }
        this.last = block
        this.collisionRects.push({ ...block })
        this.collisionRects = mergeRects(this.collisionRects)
    }
    stack(block, dir, mx, my) { // stack itself onto sth
        const { x, y } = calcStacked(block, this, dir, mx, my)
        const dx = x - this.x
        const dy = y - this.y

        this.x = x
        this.y = y

        this.children.forEach(block => {
            block.x += dx
            block.y += dy
        })

        this.collisionRects.forEach(rect => {
            rect.x += dx
            rect.y += dy
        })
    }
}

class World extends Block {
    tileW=48
    collisionRects = []
    spawnPoints = []
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
    constructor(w, h, config={}) {
        super(w, h)
        Object.assign(this, config)
        this.floor = calcAligned(this, new Block(w, config.floorHeight ?? 4), "left", "bottom")
        this.addBlock(this.floor, "fg")
    }
    addBlock(block, layer = "og", skipCollisionTest = false) {
        const { x, y } = block
        for (let i = 0; i < block.h; i++) {
            for (let j = 0; j < block.w; j++) {
                this.layers[layer].push({ x: x + j, y: y + i, w: 1, h: 1 })
            }
            if (skipCollisionTest) continue
            this.collisionRects.push({ x: block.x, y: block.y, w: block.w, h: block.h })
        }
    }
    addCompositeBlock(block, layer = "og", skipCollisionTest) {
        if (!(block instanceof CompositeBlock)) return
        for (const child of block.children) {
            this.addBlock(child, layer, true)
        }
        if (skipCollisionTest) return
        // add collision rects
        for (const rect of block.collisionRects) {
            this.collisionRects.push({...rect})
        }
        this.collisionRects = mergeRects(this.collisionRects)

        // later implement spawn point and checkpoint logic
    }
    printAscii(layer = "fg") {
        const { w, h, layers } = this;
        const grid = Array.from({ length: h }, () => Array(w).fill(' '));

        for (const cell of layers[layer]) {
            const { x, y } = cell;
            if (x >= 0 && x < w && y >= 0 && y < h) {
                grid[y][x] = '$';
            }
        }

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
            return { x: x * tileW, y: y * tileW, width: w * tileW, height: w * h, rect, mat }
        })
        const spawnPoints = this.spawnPoints.map(point => {
            const { coords, ...rest } = point
            const gameCoords = Object.entries(coords).map(([k, v]) => {
                return [ k, v / tileW ]
            })
            return { ...rest, ...Object.fromEntries(gameCoords)}
        })
        const checkPoints = this.checkpoints.map(point => {
            return {
                x: point.x / tileW,
                y: point.y / tileW
            }
        })
        const exports = { collisionRects, spawnPoints, checkPoints, fgTiles, tiles, mgTiles, bg, mob_bg, pxbg, tint }
        await fs.writeFile(`./src/assets/levels/${levelName}.cson`, JSON.stringify(exports))
    }
}

const map = new World(60, 20, {
    bg: "#132b27",
    mob_bg: "#132b27",
    pxbg: "#0a1614",
    tint: "0.025, -0.025, -0.0125, 0",
})

const leftBound = new CompositeBlock(new Block(1, 8))
leftBound.add(new Block(2, 3), "right-end")
leftBound.stack(map.floor, "top-start")

const b1 = new Block(3, 3)
Object.assign(b1, calcStacked(leftBound, b1, "right-end", 8))

const b2 = new CompositeBlock(new Block(8, 3))
b2.add(new Block(2, 2), "bottom-end")
b2.stack(b1, "top-start")

map.addCompositeBlock(leftBound, "fg")
map.addBlock(b1, "fg")
map.addCompositeBlock(b2, "fg")

map.spawnPoints.push({ name: "player", coords: calcStacked(leftBound, undefined, "right-start")})

map.printAsciiScaled("fg")
map.exportMap("testlevel")