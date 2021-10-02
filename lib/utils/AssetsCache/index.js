
import Observable from "../Observable"
import loadResource from "./loadResource"

class AssetLoader extends Observable { // static class
    assets = {}
    constructor() {
        super([ "prog", "prog-end", "load", "error" ]) // defining a set of supported events
    }
    load(assets) {
        const len = assets.length
        const thenable = Promise.resolve()
        assets.reduce((loadPrevResources, asset, index) => {
            return loadPrevResources.then(() => {
                return loadResource(asset.url).then(resource => {
                    this.assets[asset.url] = resource
                    this.emit("prog", {
                        progress: (index + 1) / len,
                        msg: asset.msg
                    })
                })
            })
        }, thenable).then(() => {
            this.emit("prog-end") // upon 100% progress (gets called before "load" event)
            this.emit("load")
            this.off("prog") // clearing all progress observers
        }).catch(e => {
            this.emit("error", e)
        })
    }
    unload(url) {
        this.assets[url] = null
    }
    get(assetUrl) {
        return this.assets[assetUrl]
    }
}

export default AssetLoader