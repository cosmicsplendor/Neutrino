import Node from "./Node"
import { isocube } from "./types"

class IsoCube extends Node {
    constructor({ length=20, width=40, frontColor="#7F7F7F", topColor="#B97A57", sideColor="#880015", ...nodeProps } = {}) {
        super({ ...nodeProps })
        this.length = length
        this.width = width
        this.frontColor = frontColor
        this.topColor = topColor
        this.sideColor = sideColor
        this.type = isocube
    }
}

export default IsoCube