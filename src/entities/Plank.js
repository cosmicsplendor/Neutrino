import Texture from "@lib/entities/Texture"
import { calcNormal, normalize } from "@utils/math"

class Plank extends Texture {
    constructor({ imgId, width, height, ...rest }) {
        super({ imgId: imgId, ...rest })
        this.width = width
        this.height = height
        const normal = calcNormal(width, height)
        const normalizedTangent = normalize(width, height)
        this.normalX = normal.x
        this.normalY = normal.y
        this.tanX = normalizedTangent.x
        this.tanY = normalizedTangent.y
    }
}

export default Plank