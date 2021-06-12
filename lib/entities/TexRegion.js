import Node from "./Node"
import { texregion } from "./types"

class TexRegion extends Node {
    constructor({ atlas: { meta, texture }, frame, ...nodeProps }) {
        super({ ...nodeProps })
        this.type = texregion
        this.texture = texture
        this.meta = meta[frame]
        this.initialRotation = this.meta.rotation ? -this.meta.rotation * Math.PI / 180 : null
        this.width =  this.meta.width
        this.height = this.meta.height
        this.w = this.initialRotation ? this.height: this.width // width on the atlas
        this.h = this.initialRotation ? this.width: this.height // height on the atlas
        if (this.initialRotation) { 
            this.initialPivotX = -this.height 
        }
    }
    setAnchor(val) {
        this.anchor = this.initialRotation ? { x: val.y, y: val.x }: val
    }
}

export const createAtlas = atlas => ({
    createRegion: (params={}) => new TexRegion({ atlas, ...params })
})

export default TexRegion