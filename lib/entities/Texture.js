import Node from "./Node"
import { texture } from "./types"

export default class Texture extends Node {
    static _assetsCache = null
    static injectAssetsCache(val) {
        this._assetsCache = val
    }
    constructor({ url, ...nodeProps }) {
        super({ ...nodeProps })
        this.img = Texture._assetsCache.get(url)
        // if (!img) {
        //     throw new Error(`Image with url ${url} can't be found in the assets cache`)
        // }
        this.type = texture
    }
}