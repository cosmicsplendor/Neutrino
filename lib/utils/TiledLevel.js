import { Node } from "@lib"

class TiledLevel extends  Node {
    constructor({ data, texatlas, ...nodeProps }) {
        super({ ...nodeProps })
        this.width = data.width
        this.height = data.height

        data.tiles.forEach(tile => {
            const region = texatlas.createRegion({ frame: tile.name, pos: { x: tile.x, y: tile.y }})
            this.add(region)
        })

        const colRects = new Node({ id: "col-rects"})
        data.collisionRects.forEach(({ x, y, width, height }) => {
            const colRect = new Node({ pos: { x, y } })
            colRect.invisible = true
            colRect.width = width
            colRect.height = height
            colRects.add(colRect)
        })

        this.add(colRects)
    }
}

export default TiledLevel