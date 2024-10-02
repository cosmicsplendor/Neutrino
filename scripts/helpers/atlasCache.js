const { getAtlas } = require("scripts/utils")

const atlasCache = {
    atlas: null,
    async get() {
        if (this.atlas === null) {
            this.atlas = await getAtlas()
        }
        return this.atlas
    }
}

module.exports = atlasCache