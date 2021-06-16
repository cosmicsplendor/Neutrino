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
        this.oneToOne = Boolean(block) && !Boolean(blocks)
        this.onHit = onHit
        this.evaluateUpdateFn = () => { 
            this.blocks = Node.get(blocks)
            this.block = Node.get(block)
            const sampleBlock = this.block || this.blocks.children[0]
            if (!sampleBlock) { return }
            // inferring collision test and update functions automatically
            this.testFn = getTestFn(this.entity, sampleBlock, { rigid, movable }) 
            return getUpdateHandler(this.entity, sampleBlock, { rigid, collision: this })
        }
    }
    test(resolve) {
        if (this.oneToOne) {
            this.block._visible && this.testFn(this.entity, this.block) && resolve(this.block)
            return
        }

        const blocks = this.blocks.children
        for (let i = blocks.length - 1; i > -1; i--) {
            const block = blocks[i]
            if (block === this.entity || block._visible === false) continue
            this.testFn(this.entity, block) && resolve(block)
        }
    }
    update() { 
        const updateFn = this.evaluateUpdateFn() // deferring the evaluation of update function until collision block(s) materialize
        if (updateFn) { 
            this.update = updateFn
            this.evaluateUpdateFn = null // clearing reference to this function so it can be garbage collected
            updateFn()
        }
    }
}

export default Collision