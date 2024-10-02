const { getAtlas } = require("../utils")

const atlasCache = {
    atlas: null,
    async contains(key) {
        const atlas = await this.get()
        return Object.keys(atlas).includes(key)
    },
    async get() {
        if (this.atlas === null) {
            this.atlas = await getAtlas()
        }
        return this.atlas
    }
}

module.exports = atlasCache