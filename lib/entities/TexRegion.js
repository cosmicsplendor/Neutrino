import Node from "./Node"
import { texregion } from "./types"

class TexRegion extends Node {
    static _assetsCache = null
    static injectAssetsCache(val) {
        this._assetsCache = val
    }
    constructor({  metaId, imgId, frame, ...nodeProps }) {
        super({ ...nodeProps })
        const meta = TexRegion._assetsCache.get(metaId)
        const img = TexRegion._assetsCache.get(imgId)
        this.type = texregion
        this.img = img
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

export const createAtlas = ({ metaId, imgId }) => ({
    createRegion: (params={}) => new TexRegion({ metaId, imgId, ...params })
})

export default TexRegion