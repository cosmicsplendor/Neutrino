import { Node, IsoCube } from "@lib"
import config from "@config"

const { viewport, blockWidth, blockHeight, stackHeight } = config

class Wall extends Node {
    constructor({ ...nodeProps}) {
        super({ gridWidth = 10, ...nodeProps })
        const grid = Array(mapWidth * stackHeight)
        this.children = grid.map((_, cellIdx) => {
            // insert cells from bottom right corner to top left cornor
            const pos = {
                x: (gridWidth - 1 - (cellIdx % gridWidth)) * blockWidth,
                y: Math.floor(cellIdx / gridWidth) * blockWidth
            }
            const block = new IsoCube({
                pos
            })
            return block
        })
    }
}

export default Wall