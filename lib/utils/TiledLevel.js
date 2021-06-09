import { Node } from "@lib"

class TiledLevel extends  Node {
    constructor({ data, texatlas, ...nodeProps }) {
        super({ ...nodeProps })
        const { collisionRects, tiles } = data
        tiles.forEach(tile => {
            const region = texatlas.createRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }})
            this.add(region)
        })
    }
}

export default TiledLevel