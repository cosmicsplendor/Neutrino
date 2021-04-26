import Collision from "@lib/components/Collision"

class BulletCollision extends Collision {
    constructor({ entity, blocks, callback = () => {} }) {
        super({ entity, blocks, callback })
    }
    update() {
        this.test(block => {
            block.remove()
            this.entity.remove()
        })
    }
}

export default BulletCollision