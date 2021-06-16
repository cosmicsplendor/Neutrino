
import Observable from "../Observable"
import loadResource from "./loadResource"

class AssetLoader extends Observable { // static class
    assets = {}
    constructor() {
        super([ "progress", "load", "error" ]) // defining a set of supported events
    }
    load(assets) {
        const len = assets.length
        const thenable = Promise.resolve()
        assets.reduce((loadPrevResources, asset, index) => {
            return loadPrevResources.then(() => {
                return loadResource(asset.url).then(resource => {
                    this.assets[asset.url] = resource
                    this.emit("progress", {
                        progress: (index + 1) / len,
                        msg: asset.msg
                    })
                })
            })
        }, thenable).then(() => {
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