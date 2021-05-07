import { Node } from "@lib"
import getTestFn from "./helpers/getTestFn"
import getUpdateHandler from "./helpers/getUpdateHandler"

class Collision {
    constructor({ entity, block, blocks, onHit = () => {}, restitution, cheap=false }) { // block and blocks are both optional, but one of them must be passed
        this.entity = entity
        this.blocks = Node.get(blocks)
        this.block = Node.get(block)
        this.oneToOne = !!block && !blocks
        this.onHit = onHit
        restitution && (this.restitution = restitution)
        const sampleBlock = this.block || this.blocks.children[0]
        this.testFn = getTestFn(entity, sampleBlock)
        this.handleUpdate = getUpdateHandler(entity, sampleBlock, { cheap })
    }
    test(resolve) {
        const { entity } = this
        const blocks = this.oneToOne ? [ this.block ]: this.blocks.children
        const blockLength = blocks.length
        for (let i = 0; i < blockLength; i++) {
            const block = blocks[i]
            if (this.testFn(entity, block)) {
                resolve(block)
            }
        }
    }
    update() {
        this.handleUpdate(this)
    }
}

export default Collision