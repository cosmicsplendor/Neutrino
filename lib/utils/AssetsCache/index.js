import Observable from "../Observable"
import getRandomMessage from "./getRandomMsg"
import loadResource from "./loadResource"

class AssetLoader extends Observable { // static class
    assets = {}
    constructor() {
        super([ "prog", "prog-end", "load", "error" ]) // defining a set of supported events
    }
    load(assets) {
        const len = assets.length
        const thenable = Promise.resolve()
        let prog = 0.01
        let timeout
        const emitProgress = () => {
            prog = prog + (Math.floor(Math.random() * 2) / 200)
            this.emit("prog", prog, getRandomMessage())
            timeout = setTimeout(emitProgress, 200 + Math.floor(Math.pow(Math.random(), 2) * 1600) )
        }
        emitProgress()
        assets.reduce((loadPrevResources, asset, index) => {
            return loadPrevResources.then(() => {
                const url = typeof asset === "string" ? asset: asset.url
                return loadResource(url).then(resource => {
                    this.assets[url] = resource
                    prog = (index + 1) / len
                    this.emit("prog", prog, getRandomMessage())
                })
            })
        }, thenable).then(() => {
            this.emit("prog-end") // upon 100% progress (gets called before "load" event)
            this.emit("load")
            this.off("prog") // clearing all progress observers
            clearTimeout(timeout)
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