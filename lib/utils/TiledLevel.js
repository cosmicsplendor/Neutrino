import { Node } from "@lib"
import { COL_RECTS } from "@lib/constants"

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
        const addParallaxTiles = (tiles, parallaxCamera) => {
            if (!tiles || tiles.length === 0) { reutrn }
            const tEnts = tiles.map(tile => texatlas.createRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }})) // tiles mapped into entities
            parallaxCamera.setWorld(this.width, this.height)
                    .setTiles(tEnts)
        } 

        this.add(colRects)

        data.collisionRects.forEach(({ x, y, width, height }) => {
            const colRect = new Node({ pos: { x, y } })
            colRect.alpha = 0
            colRect.width = width
            colRect.height = height
            colRects.add(colRect)
        })


        addParallaxTiles(data.bgTiles, bg)
        addParallaxTiles(data.fbgTiles, fbg)

        // world layer tiles
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