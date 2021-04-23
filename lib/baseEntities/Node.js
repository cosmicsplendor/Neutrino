import Vec2 from "../math/Vec2"

class Node {
    constructor({ pos = { x: 0, y: 0}, rotation = 0, scale = { x: 1, y: 1 },  anchor = { x: 0, y: 0 }, pivot = { x: 0, y: 0 }, invisible=false } = {}) {
        this.children = []
        this.pos = pos
        this.scale = scale
        this.rotation = rotation
        this.anchor = anchor
        this.pivot = pivot
        this.invisible = invisible
    }
    static globalPos(node) {
        const globalPos = { ...node.pos }
        while (!!node.parent) {
            node = node.parent
            globalPos.x += node.pos.x
            globalPos.y += node.pos.y
        }
        return globalPos
    }
    static clone(node) {
        
    }
    add(childNode) {
        childNode.parent = this
        this.children.push(childNode)
        return this
    }
    remove(childNode) {
        this.children.filter(n => n !== childNode)
    }
    updateRecursively(dt) {
        this.update && this.update(dt)
        this.children.forEach(node => {
            node.updateRecursively(dt)
        })
    }
}

export default Node