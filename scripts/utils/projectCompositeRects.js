import { findNearestCollision } from "./detectProjectedEmptySpaces"

const calcComposite = entities => { // compute a rect that contains all the entities
    const composite = { ...entities[0] }
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

class XPointer {
    edges = []
    constructor(normalDir) {
        this.normal = normalDir
    }
    eneumerate() {
        return this.edges.map(e => {
            const { x1, y1, x2 } = e
            return { x: x1, y: y1, w: x2 - x1, h: 0, normal: this.normal }
        })
    }
    record(x, y) {
        const lastEdge = this.edges[this.edges.length - 1]
        const extendExisting = y === lastEdge?.y2

        if (extendExisting) {
            lastEdge.x2 = x + 1
            return
        }

        this.edges.push({ x1: x, y1: y, x2: x + 1, y2: y })
    }
}
class YPointer {
    edges = []
    constructor(normalDir) {
        this.normal = normalDir
    }
    eneumerate() {
        return this.edges.map(e => {
            const { x1, y1, y2 } = e
            return { x: x1, y: y1, w: 0, h: y2 - y1, normal: this.normal }
        })
    }
    record(x, y) {
        const lastEdge = this.edges[this.edges.length - 1]
        const extendExisting = x === lastEdge?.x2

        if (extendExisting) {
            lastEdge.y2 = y + 1
            return
        }

        this.edges.push({ x1: x, y1: y, x2: x, y2: y + 1 })
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

const computeEdges = rects => {
    const grid = generateGrid(rects)
    const topPointer = new XPointer("top")
    const bottomPointer = new XPointer("bottom")
    const leftPointer = new YPointer("left")
    const rightPointer = new YPointer("right")
    for (let x = 0; x < grid.w; x++) {
        let ytop = 0, ybottom = grid.h - 1
        while (!grid.get(x, ytop)) {
            ytop++
        }
        topPointer.record(x, ytop)
        while (!grid.get(x, ybottom)) {
            ybottom--
        }
        bottomPointer.record(x, ybottom + 1)
    }

    for (let y = 0; y < grid.h; y++) {
        let xleft = 0, xright = grid.w - 1
        while (!grid.get(xleft, y)) {
            xleft++
        }
        leftPointer.record(xleft, y)
        while (!grid.get(xright, y)) {
            xright--
        }
        rightPointer.record(xright + 1, y)
    }
    return [rightPointer, leftPointer, topPointer, bottomPointer].flatMap(p => {
        return p.eneumerate()
    })
}

const projectCompositeRects = (compositeRects, map) => {
    const edges = computeEdges(compositeRects)
}

export default projectCompositeRects