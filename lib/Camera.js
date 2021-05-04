import Node from "@lib/baseEntities/Node"
import utils from "@lib/utils"

class Camera extends Node {
    constructor({ subject, viewport, world }) {
        super()
        this.subject = subject
        this.offset = utils.entity.center(subject)
        this.viewport = viewport
        this.world = world || viewport
    }
    focus() {
        
    }
    update(dt) {

    }
}

export default Camera