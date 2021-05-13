import { webAudioSupported } from "./Sound"
import { loadAudioBuffer } from "./Sound/adapters/WebAudio"
import { loadAudio } from "./Sound/adapters/WebAudio"

const types = Object.freeze({ AUDIO: "AUDIO", IMAGE: "IMAGE" })

const loadAudioResource = webAudioSupported ? loadAudioBuffer: loadAudio

const loadImgResource = async url => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(img)
        img.onerror = reject
    })
}

const inferType = url => {
    if (url.match(/.(jpe?g)|(png)$/)) {
        return types.IMAGE
    } else if (url.match(/.(mp3)|(wav)|(ogg)$/)) {
        return types.AUDIO
    }
}

const getLoader = url => {
    const type = inferType(url)
    switch(type) {
        case types.AUDIO:
            return loadAudioResource
        case types.IMAGE:
            return loadImgResource
        default:
            return null
    }
}

class AssetLoader {
    constructor(assets) {
        this.loaded = false
        this.load(assets).then(() => {
            this.loaded = true
            this.onLoad()
        }).catch(e => this.onError(e))
    }
    async load(assets) {
        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i]
            const loader = getLoader(asset.url)
            const resource = await loader(asset.url)
            this[asset.url] = resource
            const progress = (i + 1) * 100 / assets.length
            this.onProgress({ progress, msg: asset.msg })
        }
    }
    onLoad() { }
    onProgress() { }
    onError() { }
}

export default AssetLoader