import Sound from "../Sound"

const loadSoundResource = Sound.loadResource
const loadImgResource = url => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(img)
        img.onerror = reject
    })
}

const types = Object.freeze({ SOUND: "SOUND", IMAGE: "IMAGE" })


const loadFns = {
    [types.SOUND]: loadSoundResource,
    [types.IMAGE]: loadImgResource
}

const inferType = url => {
    if (url.match(/.(jpe?g)|(png)$/)) {
        return types.IMAGE
    } else if (url.match(/.(mp3)|(wav)|(ogg)$/)) {
        return types.SOUND
    }
}

const loadResource = url => {
    const type = inferType(url)
    const load = loadFns[type]
    return load(url)
}

export default loadResource