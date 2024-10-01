const { getAtlas, calcAligned, convertToWorld } = require("../utils");

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

const align = async (name, projection, alignment, dx, dy) => {
    const [ alignX, alignY ] = alignment.split("-")
    const dims = getDims(name)
    return calcAligned(convertToWorld(projection), dims, alignX, alignY, dx, dy)
}

module.exports = {
    getDims,
    align
}