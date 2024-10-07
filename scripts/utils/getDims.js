const atlasCache = require("../helpers/atlasCache");
const factories = require("../helpers/factories")
const getDims = async (key, props) => {
    if (key === "checkpoint") return { width: 0, height: 0 }
    const atlas = await atlasCache.get()
    if (factories[key] && typeof factories[key].dims === "function") {
        return factories[key].dims(props, atlas)
    }
    const dims = atlas[key]
    return dims.rotation === 90 ? { width: dims.height, height: dims.width } : dims
}

module.exports = getDims