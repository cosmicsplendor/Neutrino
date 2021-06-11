import { Node } from "@lib"
import getTestFn from "./helpers/getTestFn"
import getUpdateHandler from "./helpers/getUpdateHandler"

class Collision {
    constructor({ entity, block, blocks, onHit = () => {}, rigid=false, movable=true, }) { // block and blocks are both optional, but one of them must be passed
        /**
         * ------------------------------------
         *  rigid  | movable | instance | testFn
         * ------------------------------------
         *  true   |  true  |   wall   | normal
         *  true   |  false |   crate  | fixed
         *  false  |  true  |   zone   | normal
         *  false  |  false |   enemy  | normal
         */
        this.entity = entity
        this.oneToOne = !!block && !blocks
        this.onHit = onHit
        this.evaluateUpdateFn = () => { 
            this.blocks = Node.get(blocks)
            this.block = Node.get(block)
            let sampleBlock = this.block || this.blocks.children[0]
            if (!sampleBlock) { return }
            // inferring collision test and update functions automatically
            this.testFn = getTestFn(this.entity, sampleBlock, { rigid, movable }) 
            return getUpdateHandler(this.entity, sampleBlock, { rigid, collision: this })
        }
    }
    test(resolve) {
        const { entity } = this
        const blocks = this.oneToOne ? [ this.block ]: this.blocks.children
        const blockLength = blocks.length
        for (let i = 0; i < blockLength; i++) {
            const block = blocks[i]
            if (block === entity) {
                continue
            }
            if (this.testFn(entity, block)) {
                resolve(block)
            }
        }
    }
    update() { 
        const updateFn = this.evaluateUpdateFn() // deferring the evaluation of update function until collision block(s) materialize
        if (updateFn) { 
            this.update = updateFn
            this.evaluateUpdateFn = null // clear reference to this function so it can be garbage collected
            updateFn()
        }
    }
}

export default Collision