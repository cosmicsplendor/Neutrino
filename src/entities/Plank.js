import Texture from "@lib/entities/Texture"
import { PLANK } from "@lib/constants"
import { calcNormal } from "@utils/math"

class Plank extends Texture {
    constructor({ imgID, width, height, ...rest }) {
        super({ imgID: imgID, ...rest })
        this.type = PLANK
        this.width = width
        this.height = height
        const normal = calcNormal(width, height)
        this.normalX = normal.x
        this.normalY = normal.y
    }
}

export default Plank