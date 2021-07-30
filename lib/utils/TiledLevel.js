import { Node } from "@lib"
import { COL_RECTS } from "@lib/constants"
const getBaseline = tiles => {
    return tiles.reduce((acc, tile) => { // y-coordinates of the baseline where parallax entities stand (the max y-coordinate within which all the entities are bound)
        return Math.max(acc, tile.pos.y + tile.height)
    }, 0)
}
const _resettable = factory => (x, y, props) => { // returns a new factory same as the input, except that it's instances have reset method 
    const f = factory(x, y, props)
    f.reset = () => Object.assign(factory, { pos: { x, y }, ...props})
    return f
}

export const resettable = factories => { // returns a new hashmap of resettable factories
    const exports = {}
    for (let name in factories) {
        exports[name] = _resettable(factories[name])
    }
    return exports
}


class TiledLevel extends  Node {
    resetRecursively(node = this) {
        node.reset && node.reset()
        for (let child of this.children) {
            this.resetRecursively(child)
        }
    }
    constructor({ player, data, texatlas, factories={}, bg, fbg, ...nodeProps }) {
        const rFactories = resettable(factories)

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

        data.collisionRects.forEach(({ x, y, width, height, ...props }) => {
            const colRect = new Node({ pos: { x, y } })
            colRect.alpha = 0
            colRect.width = width
            colRect.height = height
            Object.assign(colRect, props)
            colRects.add(colRect)
        })

        addParallaxTiles({ tiles: data.fbgTiles, layer: fbg })
        addParallaxTiles({ tiles: data.bgTiles, layer: bg })

        data.tiles.forEach(addTile)

        // followed by objects
        this.add(objLayer)

        data.spawnPoints.forEach(({ name, className, x, y, ...props }) => {
            const factory = rFactories[name] || rFactories[className]
            if (!factory) {
                throw new Error(`no factory method provided for ${name}`)
            }
            objLayer.add(factory(x, y, props))
        })


        // finally foreground tiles
        data.fgTiles && data.fgTiles.forEach(addTile)
    }
}

export default TiledLevel