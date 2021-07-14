import { Node } from "@lib"
import { COL_RECTS } from "@lib/constants"

class TiledLevel extends  Node {
    constructor({ player, data, texatlas, factories={}, bg, fbg, ...nodeProps }) {
        super({ ...nodeProps })
        const colRects = new Node({ id: COL_RECTS })
        const objLayer = new Node({ id: "obj-layer" })
        const addTile = (tile, parent) => {
            const region = texatlas.createRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }})
            parent.add(region)
        }
        this.width = data.width
        this.height = data.height

        this.add(colRects)

        data.collisionRects.forEach(({ x, y, width, height }) => {
            const colRect = new Node({ pos: { x, y } })
            colRect.alpha = 0
            colRect.width = width
            colRect.height = height
            colRects.add(colRect)
        })

        data.bgTiles && data.bgTiles.forEach(tile => addTile(tile, fg))
        data.fbgTiles && data.fbgTiles.forEach(tile => addTile(tile, fbg))

        // world layer tiles
        data.tiles.forEach(tile => addTile(tile, this))

        // followed by objects
        this.add(objLayer)

        data.spawnPoints.forEach(({ name, x, y }) => {
            if (!factories[name]) {
                throw new Error(`no factory method provided for ${name}`)
            }
            objLayer.add(factories[name](x, y))
        })


        // finally foreground tiles
        data.fgTiles && data.fgTiles.forEach(tile => addTile(tile, this))
    }
}

export default TiledLevel