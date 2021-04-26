class Node {
    constructor({ pos = { x: 0, y: 0}, rotation = 0, scale = { x: 1, y: 1 },  anchor = { x: 0, y: 0 }, pivot = { x: 0, y: 0 }, id, invisible=false } = {}) {
        this.children = []
        this.pos = pos
        this.scale = scale
        this.rotation = rotation
        this.anchor = anchor
        this.pivot = pivot
        this.invisible = invisible
        if (Boolean(id)) {
            this.id = id
            Node.setByID(id, this)
        }
    }
    static __entities = { }
    static setByID(id, node) {
        console.log({ id })
        if (Boolean(this.__entities[id])) {
            throw new Error(`Attempting to add a node with duplicate id: ${id}`)
        }
        this.__entities[id] = node
    }
    static get(id) {
        return this.__entities[id]
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
    updateRecursively(dt) {
        this.update && this.update(dt)
        this.children.forEach(node => {
            node.updateRecursively(dt)
        })
    }
}

export default Node