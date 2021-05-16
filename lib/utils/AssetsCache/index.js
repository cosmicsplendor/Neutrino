
import Observable from "../Observable"
import loadResource from "./loadResource"

class AssetLoader extends Observable { // static class
    assets = {}
    constructor() {
        super([ "progress", "load", "error" ]) // defining a set of supported events
    }
    load(assets) {
        const promises = assets.map((asset, i) => {
            return loadResource(asset.url).then(resource => {
                this.assets[asset.url] = resource
                const progress = (i + 1) * 100 / assets.length
                this.emit("progress", { progress, msg: asset.msg })
            })
        })
        Promise.all(promises).then(() => {
            this.emit("load")
            this.off("progress") // clearing all progress observers
            this.off("error") // and error observers
        }).catch(e => {
            this.emit("error", e)
        })
    }
    get(assetUrl) {
        return this.assets[assetUrl]
    }
}

export default AssetLoader