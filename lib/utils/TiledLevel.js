import { Node } from "@lib"
import { COL_RECTS } from "@lib/constants"

class TiledLevel extends  Node {
    constructor({ data, texatlas, factories={}, ...nodeProps }) {
        super({ ...nodeProps })
        const colRects = new Node({ id: COL_RECTS })
        this.width = data.width
        this.height = data.height
        this.texatlas = texatlas

        this.add(colRects)

        // world layer tiles
        data.tiles.forEach(this.addTile)

        data.spawnPoints.forEach(({ name, x, y }) => {
            if (!factories[name]) {
                throw new Error(`no factory method provided for ${name}`)
            }
            this.add(factories[name](x, y))
        })

        data.collisionRects.forEach(({ x, y, width, height }) => {
            const colRect = new Node({ pos: { x, y } })
            colRect.alpha = 0
            colRect.width = width
            colRect.height = height
            colRects.add(colRect)
        })

        // finally foreground tiles
        data.fgTiles && data.fgTiles.forEach(this.addTile)
    }
    addTile = tile => {
        const region = this.texatlas.createRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }})
        this.add(region)
    }
}

export default TiledLevel