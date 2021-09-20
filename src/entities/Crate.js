import { TexRegion, Node } from "@lib"
import { objLayerId } from "@lib/constants"

const dmgToFrame = [
    "lcr2",
    "lcr3"
]
class Crate extends TexRegion { // breakable crate class
    constructor(x, y, dmgParticles) {
        super({ frame: "lcr1", pos: { x, y }})
        this.damage = 0
        this.dmgParticles = dmgParticles
    }
    takeDamage(dmg, vy) {
        console.log(vy)
        if (dmg < 300) { return }
        this.damage++
        if (this.damage > dmgToFrame.length) {
            this.break(vy)
            return
        }
        this.frame = dmgToFrame[this.damage - 1]
    }
    break(vy) {
        this.remove()
        console.log(vy)
        const dir = vy > 0 ? "down": "up" 
        const particle = this.dmgParticles[dir]
        particle.pos.x = this.pos.x
        particle.pos.y = this.pos.y
        Node.get(objLayerId).add(particle)
    }
}

export default Crate