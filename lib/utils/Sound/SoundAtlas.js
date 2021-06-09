import Sound from "./index"
import SoundPool from "./SoundPool"
import SoundGroup from "./SoundPool"

const toUsableFormat = meta => { // derive a new meta that our engine can use
    const frames = Object.keys(meta.spritemap)
    return frames.reduce((output, curFrame) => {
        const { start, end } = meta.spritemap[curFrame]
        output[curFrame] = { start, duration: end - start }
        return output
    }, {})
}

class SoundSprite {
    constructor({ resource, meta }) {
        if (!resource) { throw new Error(`Null resource: ${resourceID}`) }
        this.resource = resource
        this.meta = toUsableFormat(meta)
    }
    create(frame, opts) {
        const { meta, resource } = this
        const newSound = new Sound(resource, opts)
        newSound.play = newSound.play.bind(newSound, meta[frame].start, meta[frame].duration)
        return newSound
    }
    createPool(frame, opts = {}) {
        const newPool = new SoundPool({ 
            resource: this.resourceID,
            ...this.meta[frame], // destructuring to get start and duration props
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

export default SoundSprite