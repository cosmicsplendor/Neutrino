import KeyControls from "@lib/components/controls/KeyControls"

const mappings = {
    left: [ 37, 65 ],
    up: [ 38, 87 ],
    right: [ 39, 68 ],
    down: [ 40, 83 ]
}

class PlayerKeyControls extends KeyControls {
    constructor(speed) {
        super(mappings)
        this.speed = speed
    }
    update(entity, dt) {
        if (this.get("left")) {
            entity.pos.x -= this.speed * dt
        }
        if (this.get("right")) {
            entity.pos.x += this.speed * dt
        }
    }
}

export default PlayerKeyControls