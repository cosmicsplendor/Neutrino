import { math, Node } from "@lib"
import detectShape, { shapes } from "./detectShape"

export default (e1, e2) => {
    const e1Shape = detectShape(e1)
    const e2Shape = detectShape(e2)

    if (e1Shape === shapes.RECT && e2Shape === shapes.RECT && (e1.static === true || e2.static === true)) {
        return staticColUpdate
    } 
    return customColUpdate
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