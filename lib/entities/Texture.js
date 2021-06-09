import Node from "./Node"
import { texture } from "./types"

export default class Texture extends Node {
    static assetsCache = null
    constructor({ url, ...nodeProps }) {
        super({ ...nodeProps })
        this.img = Texture.assetsCache.get(url)
        // if (!img) {
        //     throw new Error(`Image with url ${url} can't be found in the assets cache`)
        // }
        this.type = texture
    }
}