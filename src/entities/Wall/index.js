import { Node } from "@lib"
import Rect from "@lib/entities/Rect"
import Movement from "@components/Movement"
import Collision from "@components/Collision"
import config from "@config"
const { viewport } = config


const asciiTilemap = 
`
                              #################                          #######################################################################################
                              #################                          #######################################################################################
                              ########################                   #######################################################################################
#                             ########################                   #######################################################################################
#                             ########################                   #######################################################################################
#########      ################################                          #######################################################################################
#########      #################################################################################################################################################
################################################################################################################################################################
`
class Wall extends Node {
    constructor({ gridWidth = 20, blockWidth = 30, blockHeight = 30, ...nodeProps} = {}) {
        super({ ...nodeProps })
        const tilemap = asciiTilemap.split("\n")
        this.width = tilemap[0].length * blockWidth
        this.height = tilemap.length * blockHeight
        console.log(`number of cells: ${tilemap.length * tilemap[0].length} `)
        this.pos.y = (viewport.height - this.height) / 2
        for (let row = 0; row < tilemap.length; row++) {
            const rowCells = tilemap[row].split("")
            for (let col = 0; col < rowCells.length; col++) {
                const cell = rowCells[col]
                if (cell === "#") {
                    const pos = {
                        x: col * blockWidth,
                        y: row * blockHeight
                    }
                    const block = new Rect({
                        pos,
                        width: blockWidth,
                        height: blockHeight,
                        fill: "dimgrey"
                    })
                    this.add(block)
                }
            }
        }
    }
}

export default Wall