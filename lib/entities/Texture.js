import Node from "./Node"
import { texture } from "./types"

export default class Texture extends Node {
    static assets
    constructor({ img, ...nodeProps }) {
        super({ ...nodeProps })
        this.img = img
        this.type = texture
    }
}