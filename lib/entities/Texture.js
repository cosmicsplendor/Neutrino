import Node from "./Node"
import { texture } from "./types"

export default class Texture extends Node {
    static assets
    static initialize(assets) {
        this.assets = assets
    }
    constructor({ imgUrl, ...nodeProps }) {
        super({ ...nodeProps })
        this.img = Texture.assets.get(imgUrl)
        this.type = texture
    }
}