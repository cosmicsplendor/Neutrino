const { getAtlas } = require("../utils");

const atlasCache = {
    atlas: null,
    async get() {
        if (this.atlas === null) {
            this.atlas = await getAtlas()
        }
        return this.atlas
    }
}

const getDims = async key => {
    const atlas = await atlasCache.get()
    return atlas[key]
}

module.exports = {
    getDims
}