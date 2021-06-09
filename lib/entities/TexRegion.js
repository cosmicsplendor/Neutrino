import Node from "./Node"
import { texregion } from "./types"

class TexRegion extends Node {
    constructor({ atlas: { meta, texture }, frame, ...nodeProps }) {
        super({ ...nodeProps })
        this.type = texregion
        this.texture = texture
        this.meta = meta
        this.frame = frame
        this.initialRotation = -meta[frame].rotation || 0
        this.width = meta[frame].width
        this.height = meta[frame].height

        this.w = this.initialRotation === -90 ? this.height: this.width // pseudo-width: width on the atlas
        this.h = this.initialRotation === -90 ? this.width: this.height // height on the atlas
        this.initialPivotX = this.initialRotation === 90 ? -this.w: 0

        this.setPivot()
        this.setAnchor()
    }
    setAnchor(anchor={}) {
        const { x = this.width/2, y = this.height/2 } = anchor

        if (!this.initialRotation) {
            this.anchor = { x, y }
            return this
        }
        this.anchor = { x: y, y: x }
        return this
    }
    setScale({ x = 1, y = 1 }) {
        if (!this.initialRotation) {
            this.scale = { x, y }
            return this
        }
        this.scale = { y, x }
        this.initialPivotX = -this.w * this.scale.y
        return this
    }
    setPivot({ x=0, y=0 } = {}) {
        if (!this.initialRotation) {
            this.initialPivotX = 0
            this.pivot = { x, y }
            return this
        }
        this.initialPivotX = -this.w
        this.pivot = { y, x }
        return this
    }
}

export const createAtlas = atlas => ({
    createRegion: (params={}) => new TexRegion({ atlas, ...params })
})

export default TexRegion