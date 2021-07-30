import { Node } from "@lib"
import { COL_RECTS } from "@lib/constants"

const getBaseline = tiles => {
    return tiles.reduce((acc, tile) => { // y-coordinates of the baseline where parallax entities stand (the max y-coordinate within which all the entities are bound)
        return Math.max(acc, tile.pos.y + tile.height)
    }, 0)
}

const _resettable = factory => (x, y, props={}) => { // returns a new factory same as the input, except that it's instances have reset method 
    const ent = factory(x, y, props)
    ent.reset = !!ent.reset ? ent.reset : () => {
        Object.assign(ent, { pos: { x, y }, ...props})
        // in case of non-zero and non-null velocity
        if (ent.velX) { ent.velX = 0 }
        if (ent.velY) { ent.velY = 0 }
    }
    return ent
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
        // if there isn't a custom player factory in the factories dict, create and add a new one
        factories.player = factories.player ? factories.palyer: (x, y, props={}) => { // a pseudo player factory that reuses the player passed into the map, and gives it to "player" spawn-point handler
            player.pos.x = x
            player.pos.y = y
            Object.assign(player, props)
            player.onRemove = () => delete player.parent
            return player
        }
        const rFactories = resettable(factories)

        super({ ...nodeProps })
        const colRects = new Node({ id: COL_RECTS }) // collision rects are invisible, so whenre in the scene graph they go doesn't matter
        const objNode = new Node() // node for entities created via factories; it goes between world layer and foreground
        objNode.getGroup = id => { // all the collision groups should go into objNode
            const g = Node.get(id)
            if (!g) { // if g isn't there, create a new one, add it to the objNode and return it
                const newG = new Node({ id })
                objNode.add(newG)
                return newG
            }
            return g
        } 
        const addTile = ({ name, x, y, ...props }) => {
            const factory = rFactories[tile.name]
            if (factory) { // in case there exists a factory for creating the tile with this particular name, giving that a precedence
                const parentNode = !!groupId ? objNode.getGroup(groupId): objNode
                parentNode.add(factory(x, y, props))
                return
            }
            const region = texatlas.createRegion({ frame: name, pos: { x: x, y: y }})
            this.add(region)
        }
        const addParallaxTiles = ({ tiles, layer }) => {
            if (!tiles || tiles.length === 0) { return }
            const tEnts = tiles.map(tile => texatlas.createRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }}))  // tiles mapped into entities,
            layer.layoutTiles({ 
                tiles: tEnts,
                baseline: getBaseline(tEnts),
                worldWidth: data.width, 
                worldHeight: data.height, 
            })
        }

        // adding tiles to parallax background cameras
        addParallaxTiles({ tiles: data.fbgTiles, layer: fbg })
        addParallaxTiles({ tiles: data.bgTiles, layer: bg })
        
        // adding col-rects first
        this.add(colRects)
        data.collisionRects.forEach(({ x, y, width, height, ...props }) => {
            const colRect = new Node({ pos: { x, y } })
            colRect.alpha = 0
            colRect.width = width
            colRect.height = height
            Object.assign(colRect, props)
            colRects.add(colRect)
        })


        // followed by, world-layer tiles
        data.tiles.forEach(addTile)


        // and then objNode node
        this.add(objNode)
        data.spawnPoints.forEach(({ name, x, y, id, groupId, ...props }) => {
            const factory = rFactories[name]
            if (!factory) {
                throw new Error(`no factory method provided for ${name}`)
            }
            const parentNode = !!groupId ? objNode.getGroup(groupId): objNode
            parentNode.add(factory(x, y, props))
        })


        // finally foreground tiles
        data.fgTiles && data.fgTiles.forEach(addTile)

        this.width = data.width
        this.height = data.height
    }
}

export default TiledLevel