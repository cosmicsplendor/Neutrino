const {findNearestCollision} = require("./detectProjectedEmptySpaces")
const {generateGrid} = require("./index")

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

const projectCompositeRects = (compositeRects, collisionRects, map) => {
    const edges = computeEdges(compositeRects)

    return edges.map(edge => {
        const isHorizontal = edge.normal === "left" || edge.normal === "right"
        return findNearestCollision(edge.normal, isHorizontal, collisionRects, edge, map)
    })
}

export default projectCompositeRects