class Pool {
    constructor({ factory, fixed = true, size, free }) {
        this.factory = factory
        this.fixed =fixed
        this.size = size
        this.free = free
        this.list = Array(size).fill(0)
        this.lastIdx = 0
    }
    create() {
        this.lastIdx = (this.lastIdx + 1) / this.list.length
        if (!this.list[this.lastIdx]) { this.list[this.lastIdx] = this.factory() }
        const bullet = this.list[this.lastIdx]
        this.free && this.free(bullet)
        return bullet
    }
}

export default Pool