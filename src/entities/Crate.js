import { TexRegion } from "@lib"

const dmgToFrame = [
    "lcr2",
    "lcr3"
]
class Crate extends TexRegion { // breakable crate class
    constructor(x, y) {
        super({ frame: "lcr1", pos: { x, y }})
        this.damage = 0
    }
    takeDamage() {
        this.damage++
        const frame = dmgToFrame[this.damage - 1]
        if (!frame) { return }
        this.frame = frame
    }
}

export default Crate