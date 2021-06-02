import SoundPool from "./SoundPool"
import SoundGroup from "./SoundPool"

class SoundAtlas {
    constructor({ resourceID, meta, assetsCache }) {
        this.resourceID = resourceID
        this.meta = meta
        this.assetsCache = assetsCache
    }
    createPool(frame, size) {
        const { resourceID, meta } = this
        const resource = this.assetsCache.get(resourceID)
        if (!resource) { throw new Error(`Null resource: ${resourceID}`) }
        const newPool = new SoundPool({ 
            resource,
            size,
            ...meta.spritemap[frame] // destructuring to get start and end props
        })
        return newPool
    }
    createGroup(frames, poolSize) {
        const mutations = frames.map(frame => this.createPool(frame, poolSize))
        return new SoundGroup(mutations)
    }
}

export default SoundAtlas