import { Node } from "@lib"
import { COL_RECTS } from "@lib/constants"
const getBaseline = tiles => {
    return tiles.reduce((acc, tile) => { // y-coordinates of the baseline where parallax entities stand (the max y-coordinate within which all the entities are bound)
        return Math.max(acc, tile.pos.y + tile.height)
    }, 0)
}

class TiledLevel extends  Node {
    constructor({ player, data, texatlas, factories={}, bg, fbg, ...nodeProps }) {
        super({ ...nodeProps })
        const colRects = new Node({ id: COL_RECTS })
        const objLayer = new Node({ id: "obj-layer" })
        this.width = data.width
        this.height = data.height
        const addTile = tile => {
            const region = texatlas.createRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }})
            this.add(region)
        }
        const addParallaxTiles = ({ tiles, layer }) => {
            if (!tiles || tiles.length === 0) { return }
            const tEnts = tiles.map(tile => texatlas.createRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }}))  // tiles mapped into entities,
            layer.layoutTiles({ 
                tiles: tEnts,
                baseline: getBaseline(tEnts),
                worldWidth: this.width, 
                worldHeight: this.height, 
            })
        } 

        this.add(colRects)

        data.collisionRects.forEach(({ x, y, width, height }) => {
            const colRect = new Node({ pos: { x, y } })
            colRect.alpha = 0
            colRect.width = width
            colRect.height = height
            colRects.add(colRect)
        })

        addParallaxTiles({ tiles: data.fbgTiles, layer: fbg })
        addParallaxTiles({ tiles: data.bgTiles, layer: bg })
        // console.log(data.bgTiles)
        // console.log(data.fbgTiles)

        // world layer tiles
        // data.fbgTiles.forEach(addTile)
        // data.bgTiles.forEach(addTile)
        data.tiles.forEach(addTile)

        // followed by objects
        this.add(objLayer)

        data.spawnPoints.forEach(({ name, x, y }) => {
            if (!factories[name]) {
                throw new Error(`no factory method provided for ${name}`)
            }
            objLayer.add(factories[name](x, y))
        })


        // finally foreground tiles
        data.fgTiles && data.fgTiles.forEach(addTile)
    }
}

export default TiledLevel