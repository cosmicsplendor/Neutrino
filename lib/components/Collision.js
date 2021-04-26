import { math } from "@lib"

class Collision {
    constructor({ entity, blocks }) {
        this.entity = entity
        this.blocks = blocks
    }
    test(callback) {
        const { entity } = this
        const blocks = this.blocks.children
        const blockLength = blocks.length
        for (let i = 0; i < blockLength; i++) {
            const block = blocks[i]
            if (math.aabb(block, entity)) {
                callback(block)
            }
        }
    }
}

export default Collision