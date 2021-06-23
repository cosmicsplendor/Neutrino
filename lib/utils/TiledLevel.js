import { Node } from "@lib"
import { COL_RECTS } from "@lib/constants"

class TiledLevel extends  Node {
    constructor({ data, texatlas, factories={}, ...nodeProps }) {
        super({ ...nodeProps })
        this.width = data.width
        this.height = data.height

        data.tiles.forEach(tile => {
            const region = texatlas.createRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }})
            this.add(region)
        })

        const colRects = new Node({ id: COL_RECTS })

        data.collisionRects.forEach(({ x, y, width, height }) => {
            const colRect = new Node({ pos: { x, y } })
            colRect.alpha = 0
            colRect.width = width
            colRect.height = height
            colRects.add(colRect)
        })

        data.spawnPoints.forEach(({ name, x, y }) => {
            if (!factories[name]) {
                throw new Error(`no factory method provided for ${name}`)
            }
            this.add(factories[name](x, y))
        })

        this.add(colRects)
    }
}

export default TiledLevel