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
    const dims = name === "checkpoint" ? { width: 0, height: 0}: await getDims(name)
    const aligned = calcAligned(convertToWorld(projection), { w: dims.width, h: dims.height }, alignX, alignY, dx, dy)
    return aligned
}

module.exports = {
    getDims,
    align
}