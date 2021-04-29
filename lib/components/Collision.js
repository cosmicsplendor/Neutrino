import { math, Node } from "@lib"

const shapes = {
    CIRC: "circle",
    RECT: "rect"
}

const detectShape = entity => {
    const shape = !!entity.hitCirc ? shapes.CIRC: shapes.RECT
    if (shape === shapes.RECT && !entity.hitBox && !entity.width & !width.height) {
        throw new Error(`Unable to determine entity shape: \n${JSON.stringify(entity, null, 3)}`)
    }
    return shape
}

const getTestFn = (e1, e2) => {
    const e1Shape = detectShape(e1)
    const e2Shape = detectShape(e2)

    if (e1Shape === shapes.RECT && e2Shape === shapes.RECT) {
        return math.aabb
    } 
    if (e1Shape === shapes.CIRC && e2Shape === shapes.CIRC) {
        return math.circCirc
    } 
    if (e1Shape === shapes.CIRC && e2Shape === shapes.RECT) {
        return (e1, e2) => math.aabbCirc({ circ: e1, rect: e2 })
    }
    if (e1Shape === shapes.RECT && e2Shape === shapes.CIRC) {
        return (e1, e2) => math.aabbCirc({ circ: e2, rect: e1 })
    }
}
const getUpdateFn = (e1, e2) => {
    const e1Shape = detectShape(e1)
    const e2Shape = detectShape(e2)

    if (e1Shape === shapes.RECT && e2Shape === shapes.RECT && (e1.static === true || e2.static === true)) {
        return staticColUpdate
    } 
    return customColUpdate
}

class Collision {
    constructor({ entity, block, blocks }) { // block and blocks are optional, but one of them must be passed
        this.entity = entity
        this.blocks = Node.get(blocks)
        this.block = Node.get(block)
        this.oneToOne = !!block && !blocks
        this.testFn = getTestFn(entity, this.block || this.blocks.children[0])
        this.update = getUpdateFn(entity, this.block || this.blocks.children[0]).bind(this)
    }
    test(resolve) {
        const { entity } = this
        const blocks = this.oneToOne ? [ this.block ]: this.blocks.children
        const blockLength = blocks.length
        for (let i = 0; i < blockLength; i++) {
            const block = blocks[i]
            if (this.testFn(block, entity)) {
                resolve(block)
                this.callback(block)
            }
        }
    }
}

function staticColUpdate() {
    const { entity } = this
    const movement = { x: entity.pos.x - entity.prevPos.x, y: entity.pos.y - entity.prevPos.y }

    entity.pos.y -= movement.y // undoing y movement so we can test x collision first
    movement.x && this.test(block => {
        const blockBounds = math.rectBounds(block)
        entity.vel.x = 0
        if (movement.x > 0) { // collision with the left edge
            Node.setLoclaPos(entity, { x: blockBounds.x - entity.width })
            return
        }
        // collision with the right edge
        Node.setLoclaPos(entity, { x: blockBounds.x + blockBounds.width })
    })

    entity.pos.y += movement.y // redoing y movement
    movement.y && this.test(block => {
        const blockBounds = math.rectBounds(block)
        entity.vel.y = 0
        if (movement.y > 0) { // collision with the top edge
            entity.pos.y = blockBounds.y - entity.height
            Node.setLoclaPos(entity, { y: blockBounds.y - entity.height })
            return
        }
        // collision with the bottom edge
        Node.setLoclaPos(entity, { y: blockBounds.y + blockBounds.height })
    })
}

function customColUpdate() {
    this.test()
}

export default Collision