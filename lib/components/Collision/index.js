import { Node } from "@lib"
import getTestFn from "./helpers/getTestFn"
import getUpdateFn from "./helpers/getUpdateFn"

class Collision {
    constructor({ entity, block, blocks, callback = () => {}, restitution }) { // block and blocks are optional, but one of them must be passed
        this.entity = entity
        this.blocks = Node.get(blocks)
        this.block = Node.get(block)
        this.oneToOne = !!block && !blocks
        this.testFn = getTestFn(entity, this.block || this.blocks.children[0])
        this.update = getUpdateFn(entity, this.block || this.blocks.children[0]).bind(this)
        this.callback = callback
        restitution && (this.restitution = restitution)
    }
    test(resolve) {
        const { entity } = this
        const blocks = this.oneToOne ? [ this.block ]: this.blocks.children
        const blockLength = blocks.length
        for (let i = 0; i < blockLength; i++) {
            const block = blocks[i]
            if (this.testFn(entity, block)) {
                this.callback(block)
                resolve(block)
            }
        }
    }
}

export default Collision