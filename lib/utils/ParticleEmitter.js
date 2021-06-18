import { Node } from "@lib"
import Rect from "@lib/entities/Rect"
import { rand, pickOne } from "@utils/math"
import Movement from "@components/Movement"

const colors = [ "lavender", "whitesmoke", "snow" ]

class Particle extends Rect {
    constructor() {
        super({ width: rand(2, 4), height: rand(14, 18), fill: pickOne(colors) })
        this.alpha = 0.5
        Movement.makeMovable(this, { velY: rand(300, 600) })
        this.pos.x = rand(0, 1600)
    }
    update(dt) {
        Movement.update(this, dt)
        if (this.pos.y > 150 || this.pos.y < -400) {
            this.pos.y = 0
            // this.pos.x = rand(0, 1600)
            this.velY = rand(400, 600)
        }
    }
}

class ParticleSystem extends Node {
    constructor({ size = 200, ...nodeProps }) {
        super({ ...nodeProps })
        this.size = size
        for (let i = 0; i < size; i++) {
            this.add(new Particle(this))
        }
    }
}

export default ParticleSystem