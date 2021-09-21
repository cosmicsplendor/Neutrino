import { TexRegion, Node } from "@lib"
import { objLayerId } from "@lib/constants"
import { clamp } from "@utils/math"
import Timer from "@utils/Timer"

const dmgToFrame = [
    "lcr2",
    "lcr3"
]
class Crate extends TexRegion { // breakable crate class
    constructor(x, y, dmgParticles, orbPool, sounds, luck=50, dmg=0, player) {
        super({ frame: "lcr1", pos: { x, y }})
        this.dmgParticles = dmgParticles
        this.orbPool = orbPool
        this.player = player
        this.sounds = sounds
        this.luck = luck
        this.damage = clamp(0, dmgToFrame.length, dmg)
        if (this.damage > 0) {
            this.frame = dmgToFrame[this.damage - 1]
        }
    }
    takeDamage(vy) {
        if (Math.abs(vy) < 300) { return }
        this.damage++
        if (this.damage > dmgToFrame.length) {
            this.break(vy)
            return
        }
        this.frame = dmgToFrame[this.damage - 1]
    }
    break(vy) {
        this.remove()
        const dir = vy > 0 ? "down": "up" 
        const particle = this.dmgParticles[dir]
        particle.pos.x = this.pos.x
        particle.pos.y = this.pos.y
        this.sounds.snap.play()
        if (Math.random() < this.luck / 100) { // chance of spawning is determined by luck factor
            const orb = this.orbPool.create(this.pos.x - 6 + this.width / 2, this.pos.y -6 + this.height / 2, null,  this.player )
            orb.active = false
            orb.add(new Timer(1, null, () => {
                orb.active = true
            }))
            Node.get(objLayerId).add(orb)
        }
        Node.get(objLayerId).add(particle)
    }
}

export default Crate