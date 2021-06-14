class Node {
    constructor({ pos = { x: 0, y: 0}, rotation, scale,  anchor, pivot, id, alpha } = {}) {
        this.children = []
        this.pos = pos
        scale && (this.scale = scale)
        rotation && (this.rotation = rotation)
        anchor && (this.anchor = anchor)
        pivot && (this.pivot = pivot)
        alpha && (this.alpha = alpha)
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
    static updateRecursively(node, dt, t, rootNode = node) {
        if (node.movable) {
            node.prevPosX = node.pos.x
            node.prevPosY = node.pos.y
        }
        node.visible = rootNode.intersects ? rootNode.intersects(node): true
        node.visible && node.update && node.update(dt, t)
        for (let i = node.children.length - 1; i > -1; i--) {
            Node.updateRecursively(node.children[i], dt, t, rootNode)
        }
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