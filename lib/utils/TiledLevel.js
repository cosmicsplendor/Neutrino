import { Node } from "@lib"
import TexRegion from "@lib/entities/TexRegion"
import { colRectsId, curLevelId, objLayerId } from "@lib/constants"
import config from "@config"

const getBaseline = tiles => {
    return tiles.reduce((acc, tile) => { // y-coordinates of the baseline where parallax entities stand (the max y-coordinate within which all the entities are bound)
        return Math.max(acc, tile.pos.y + tile.height)
    }, 0)
}

const _resettable = factory => (x, y, props={}, player) => { // returns a new factory same as the input, except that it's instances have reset method 
    const ent = factory(x, y, props, player)
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
        if (!node.children) return
        for (let child of node.children) {
            this.resetRecursively(child)
        }
    }
    constructor({ player, data, factories={}, bg, fbg, ...nodeProps }) {
        // if there isn't a custom player factory in the factories dict, create and add a new one
        factories.player = factories.player ? factories.palyer: (x, y, props={}) => { // a pseudo player factory that reuses the player passed into the map, and gives it to "player" spawn-point handler
            player.reset = () => {
                player.pos.x = x
                player.pos.y = y
                player.alpha = 1
                player.velY = player.velX = 0
                Object.assign(player, props)
                player.onRemove = () => delete player.parent // free-up the reference for garbage collector
            }
            player.reset()
            return player
        }
        const rFactories = resettable(factories)

        super({ ...nodeProps, id: curLevelId })
        const colRects = new Node({ id: colRectsId }) // collision rects are invisible, so wherever in the scene graph they go doesn't matter
        const objNode = new Node({ id: objLayerId }) // node for entities created via factories; it goes between world layer and foreground
        const mgObjNode = new Node() // midground tile-group that lies behind the world layer
        const fgObjNode = new Node()
        const objNodeMap = {
            mg: mgObjNode,
            world: objNode,
            fg: fgObjNode
        }
        const getGroup = function(id) { // all the collision groups in particular node should go to it's respective objLayer
            const g = Node.get(id)
            if (!g) { // if g isn't there, create a new one, add it to the objNode and return it
                const newG = new Node({ id })
                this.add(newG)
                return newG
            }
            return g
        } 
        objNode.getGroup = getGroup
        mgObjNode.getGroup = getGroup
        fgObjNode.getGroup = getGroup
        const addTiles = (tiles, layer) => {
            const objNode = objNodeMap[layer]
            const addTile = ({ name, x, y, groupId, ...props }) => {
                const factory = rFactories[name]
                if (factory) { // in case there exists a factory for creating the tile with this particular name, give that a precedence
                    const parentNode = !!groupId ? objNode.getGroup(groupId): objNode
                    parentNode.add(factory(x, y, props, player))
                    return
                }
                const region = new TexRegion({ frame: name, pos: { x: x, y: y }})
                const parentNode = groupId ? objNode.getGroup(groupId): this
                parentNode.add(region)
            }
            tiles.forEach(addTile)
        }
        const addParallaxTiles = ({ tiles, layer }) => {
            if (!tiles || tiles.length === 0) { return }
            const tEnts = tiles.map(tile => new TexRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }}))  // tiles mapped into entities,
            layer.layoutTiles({ 
                tiles: tEnts,
                baseline: getBaseline(tEnts),
                worldWidth: data.width, 
                worldHeight: data.height, 
            })
        }
        const addSpawnPoint = ({ name, x, y, groupId, ...props }) => {
            const factory = rFactories[name]
            if (!factory) {
                throw new Error(`no factory method provided for ${name}`)
            }
            const parentNode = !!groupId ? objNode.getGroup(groupId): objNode
            parentNode.add(factory(x, y, props, player))
        }
        const addColRect = ({ x, y, width, height, ...props }) => {
            const colRect = new Node({ pos: { x, y } })
            colRect.alpha = 0
            colRect.width = width
            colRect.height = height
            Object.assign(colRect, props)
            colRects.add(colRect)
        }

        if (!config.isMobile) {
            // adding tiles to parallax background cameras
            addParallaxTiles({ tiles: data.fbgTiles, layer: fbg })
            addParallaxTiles({ tiles: data.bgTiles, layer: bg })
        }
        
        
        // adding col-rects first
        data.collisionRects.forEach(addColRect)
        this.add(colRects)

        // followed by midground tiles and mgObjNode
        addTiles(data.mgTiles, "mg")
        this.add(mgObjNode)

        // then, world-layer tiles, objNode and spawnPoints (all of which lie on world layer)
        addTiles(data.tiles, "world")
        this.add(objNode)
        data.spawnPoints.forEach(addSpawnPoint)

        // and finally foreground tiles and fgObjNode
        addTiles(data.fgTiles, "fg")
        this.add(fgObjNode)

        this.width = data.width
        this.height = data.height
    }
}

export default TiledLevel