import { TexRegion }from "@lib"

class Bus extends TexRegion {
    constructor(x, y) {
        super({ frame: "crane", pos: { x, y } })
    }
}

export default Bus