import { math } from "@lib"
class Collision {
    constructor({ entity, blocks, callback = () => {} }) {
        this.entity = entity
        this.blocks = blocks
        this.callback = callback
    }
    update({ from, to }) {
        const { entity, blocks } = this
        const blockLength = blocks.length
        for (let i = 0; i < blockLength; i++) {
            const block = blocks[i]
            if (math.aabb(block, entity)) {
                entity.pos = from
                entity.vel = { x: 0, y: 0 }
                this.callback(entity, block, i)
            }
        }
    }
}

export default Collision