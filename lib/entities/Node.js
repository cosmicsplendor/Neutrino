class Node {
    constructor({ pos = { x: 0, y: 0}, rotation, scale,  anchor, pivot, id } = {}) {
        this.children = []
        this.pos = pos
        scale && (this.scale = scale)
        rotation && (this.rotation = rotation)
        anchor && (this.anchor = anchor)
        pivot && (this.pivot = pivot)
        if (Boolean(id)) {
            this.id = id
            Node.setByID(id, this)
        }
    }
    static __entities = { }
    static setByID(id, node) {
        this.__entities[id] = node
    }
    static get(id) {
        return this.__entities[id]
    }
    static updateRecursively(node, dt) {
        if (node.movable) {
            node.prevPosX = node.pos.x
            node.prevPosY = node.pos.y
        }
        node.update && node.update(dt)
        node.children.forEach(childNode => {
            Node.updateRecursively(childNode, dt)
        })
    }
    add(childNode) {
        childNode.parent = this
        this.children.push(childNode)
        return this
    }
    remove(childNode) {
        if (!!childNode) {
            this.children = this.children.filter(n => n !== childNode)
            return
        }
        this.parent.remove(this)
    }
}

export default Node