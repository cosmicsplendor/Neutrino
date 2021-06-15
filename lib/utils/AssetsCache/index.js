
import Observable from "../Observable"
import loadResource from "./loadResource"

class AssetLoader extends Observable { // static class
    assets = {}
    constructor() {
        super([ "progress", "load", "error" ]) // defining a set of supported events
    }
    load(assets) {
        let loadPrevResources = Promise.resolve()
        for (let i = 0, len = assets.length; i < len; i++) {
            loadPrevResources = loadPrevResources.then(() => {
                return loadResource(assets[i].url).then(resource => {
                    this.assets[assets[i].url] = resource
                    this.emit("progress", {
                        progress: (i + 1) / len,
                        msg: assets[i].msg
                    })
                })
            })
        }
        loadPrevResources.then(() => {
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