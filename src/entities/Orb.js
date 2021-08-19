import orbImgId from "@assets/images/orb.png"
import { Texture } from "@lib/entities"
import { len, rand } from "@lib/utils/math"

class Orb extends Texture {
    constructor(player) {
        super({ imgId: orbImgId })
        this.pos.y = 1200
        this.pos.x = 500
        this.player = player
        this.pivot = { x: 1, y: 1 }
    }
    flicker() {
        this.pos.x += rand(4) - 2
        this.pos.y += rand(4) - 2
    }
    update(dt) {
        const dPosX = this.player.pos.x + this.player.width / 2 - this.pos.x
        const dPosY = this.player.pos.y + this.player.width / 2 - this.pos.y
        if (len(dPosX, dPosY) > 200) {
            return
        }
        this.pos.x += dPosX / 30
        this.pos.y += dPosY / 30
    }
}

export default Orb