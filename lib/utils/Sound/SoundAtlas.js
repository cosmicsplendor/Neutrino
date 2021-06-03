import SoundPool from "./SoundPool"
import SoundGroup from "./SoundPool"

const toUsableFormat = meta => { // derive a new meta that our engine can use
    const frames = Object.keys(meta.spritemap)
    return frames.reduce((output, curFrame) => {
        const { start, end } = meta.spritemap[curFrame]
        output[curFrame] = { start, duration: end - start }
    }, {})
}

class SoundAtlas {
    constructor({ resourceID, meta, assetsCache }) {
        this.resourceID = resourceID
        this.meta = toUsableFormat(meta)
        this.assetsCache = assetsCache
    }
    getResource() {
        const resource = this.assetsCache.get(this.resourceID)
        if (!resource) { throw new Error(`Null resource: ${resourceID}`) }
        return resource
    }
    create(frame, opts) {
        const { getResource, meta } = this
        const newSound = new Sound(getResource(), opts)
        newSound.play = newSound.play.bind(newSound, meta[frame].start, meta[frame].duration)
        return newSound
    }
    createPool(frame, opts = {}) {
        const { getResource, meta } = this
        const newPool = new SoundPool({
            resource: getResource(),
            ...meta[frame], // destructuring to get start and duration props
            ...opts
        })
        return newPool
    }
    createGroup(frames, poolSize) {
        const mutations = frames.map(frame => this.createPool(frame, poolSize))
        const newGroup = new SoundGroup(mutations)
        return newGroup
    }
}

export default SoundAtlas