class Node {
    constructor({ pos = { x: 0, y: 0}, rotation, scale,  anchor, pivot, id, alpha } = {}) {
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
        if (!node.children) { return }
        for (let i = 0, len = node.children.length; i < len; i++) {
            Node.updateRecursively(node.children[i], dt, t, rootNode)
        }
    }
    add(childNode) {
        childNode.parent = this
        if (Boolean(this.children)) {
            this.children.push(childNode)
            return this
        }
        this.children = [ childNode ]
        return this
    }
    remove(childNode) {
        if (Boolean(childNode)) {
            this.children = this.children.filter(n => n !== childNode)
            return
        }
        this.parent.remove(this)
    }
}

export default Node