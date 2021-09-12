import { TexRegion } from "@lib"
class Magnet extends TexRegion {
    constructor(props) {
        super(props)
        this.tint = [ 0.06, 0.03, 0.01, 0 ]
        this.vel = 1
        this.tintVal = 0
        this.forceUpdate = true
    }
    update(dt) {
        this.tintVal += dt * this.vel / 6
        if (this.tintVal > 0.02) {
            this.vel = -1
            this.tintVal = 0.02
        } else if (this.tintVal < -0.14) {
            this.vel = 1
            this.tintVal = -0.14
        }
        this.tint[0] = this.tintVal
        this.tint[1] = this.tintVal
        this.tint[2] = this.tintVal
    }
}

export default Magnet