import { TexRegion, Node } from "@lib"
import { objLayerId } from "@lib/constants"

const dmgToFrame = [
    "lcr2",
    "lcr3"
]
class Crate extends TexRegion { // breakable crate class
    constructor(x, y, particle) {
        super({ frame: "lcr1", pos: { x, y }})
        this.damage = 0
        this.particle = particle
    }
    takeDamage(dmg) {
        if (dmg < 300) { return }
        this.damage++
        if (this.damage > dmgToFrame.length) {
            this.break()
            return
        }
        this.frame = dmgToFrame[this.damage - 1]
    }
    break() {
        this.remove()
        this.particle.pos.x = this.pos.x
        this.particle.pos.y = this.pos.y
        Node.get(objLayerId).add(this.particle)
    }
}

export default Crate