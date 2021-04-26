import { Node, Rect } from "@lib"
import config from "@config"

const { blockWidth, blockLength, stackHeight, viewport } = config

class Wall extends Node {
    constructor({ gridWidth = 20, ...nodeProps} = {}) {
        super({ ...nodeProps })
        const cellCount = gridWidth * stackHeight
        const height = stackHeight * blockWidth
        this.pos = {
            x: blockLength + 50,
            y: (viewport.height - height) / 2,
        }
        const grid = Array(cellCount).fill(0).map((_, index) => {
            if (
                index / gridWidth < 1 ||
                (index / gridWidth < 2 && Math.random() < 0.2) ||
                (index < cellCount * 2 / 3 && Math.random() < 0.3)
                // (index < cellCount * 1 / 2 && Math.random() < 0.4)
            ) {
                return false
            }
            return true
        })
        
        // wall blocks
        for (let cellIdx = cellCount - 1; cellIdx > -1; cellIdx--) {
            const pos = {
                x:  (gridWidth - 1 - cellIdx % gridWidth) * blockWidth,
                y: Math.floor(cellIdx / gridWidth) * blockWidth
            }
            const block = new Rect({
                pos,
                width: blockWidth,
                height: blockWidth,
                invisible: !grid[cellIdx],
                fill: "dimgrey"
            })
            this.add(block)
        }
    }
}

export default Wall