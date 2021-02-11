import Node from "../Node"
import { texregion } from "./types"

class TexRegion extends Node {
    constructor({ atlas: { meta, texture }, frame, ...nodeProps }) {
        super({ ...nodeProps })
        this.type = texregion
        this.texture = texture
        this.meta = meta
        this.frame = frame
    }
    static createAtlas = atlas => ({
        createRegion: params => new TexRegion({ atlas, ...params })
    })
}



export default TexRegion