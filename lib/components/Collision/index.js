import { Node } from "@lib"
import getTestFn from "./helpers/getTestFn"
import getUpdateHandler from "./helpers/getUpdateHandler"

class Collision {
    constructor({ entity, block, blocks, onHit = () => {}, restitution=0, resolve }) { // block and blocks are both optional, but one of them must be passed
        this.entity = entity
        this.oneToOne = !!block && !blocks
        this.onHit = onHit
        this.update = () => { // deferring the evaluation of test and update functions until collision block(s) materialize
            this.blocks = Node.get(blocks)
            this.block = Node.get(block)
            let sampleBlock = this.block || this.blocks.children[0]
            if (!sampleBlock) { return }
            this.testFn = getTestFn(this.entity, sampleBlock)
            this.update = getUpdateHandler(this.entity, sampleBlock, { resolve, restitution, collision: this })
            sampleBlock = null // clear a reference to an unnecessary object for garbage collection 
        }
        this.update()
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
}

export default Collision