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
        if (Boolean(this.__entities[id])) {
            throw new Error(`Attempting to add a node with duplicate id: ${id}`)
        }
        this.__entities[id] = node
    }
    static get(id) {
        return this.__entities[id]
    }
    static setLocalPos(node, globalPos) {
        let parent = node.parent
        let localPos = { }
        while (parent) {
            globalPos.x && (localPos.x = globalPos.x - parent.pos.x)
            globalPos.y && (localPos.y = globalPos.y - parent.pos.y)
            parent = parent.parent
        }
        node.pos = { ...node.pos, ...localPos }
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
    static root(node) {
        if (!node.parent) {
            return node
        }
        return this.root(node.parent)
    }
    static clone(node) {
        
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
    update(dt) {
        this.components.forEach(component => component.update(dt))
    }
    updateRecursively(dt) {
        this.update && this.update(dt)
        this.children.forEach(node => {
            node.updateRecursively(dt)
        })
    }
}

export default Node