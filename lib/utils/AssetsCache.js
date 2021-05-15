import { webAudioSupported } from "./Sound"
import { loadAudioBuffer } from "./Sound/strategies/WebAudio"
import { loadAudio } from "./Sound/strategies/HTML5Audio"
import Observable from "./Observable"

const types = Object.freeze({ AUDIO: "AUDIO", IMAGE: "IMAGE" })

const loadAudioResource = webAudioSupported ? loadAudioBuffer: loadAudio

const loadImgResource = url => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(img)
        img.onerror = reject
    })
}

const loadFns = {
    [types.AUDIO]: loadAudioResource,
    [types.IMAGE]: loadImgResource
}

const inferType = url => {
    if (url.match(/.(jpe?g)|(png)$/)) {
        return types.IMAGE
    } else if (url.match(/.(mp3)|(wav)|(ogg)$/)) {
        return types.AUDIO
    }
}

const loadResource = url => {
    const type = inferType(url)
    const load = loadFns[type]
    return load(url)
}

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