import { TexRegion, Node } from "@lib"
import { objLayerId } from "@lib/constants"
import Timer from "@utils/Timer"

const dmgToFrame = [
    "lcr2",
    "lcr3"
]
class Crate extends TexRegion { // breakable crate class
    constructor(x, y, dmgParticles, orbPool, sounds, player) {
        super({ frame: "lcr1", pos: { x, y }})
        this.damage = 0
        this.dmgParticles = dmgParticles
        this.orbPool = orbPool
        this.player = player
        this.sounds = sounds
    }
    takeDamage(dmg, vy) {
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
        const dir = vy > 0 ? "down": "up" 
        const particle = this.dmgParticles[dir]
        particle.pos.x = this.pos.x
        particle.pos.y = this.pos.y
        this.sounds.snap.play()
        if (Math.random() < 0.5) { // 50-50 chance of spawning
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