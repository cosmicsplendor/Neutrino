const atlasCache = require("../helpers/atlasCache");
const factories = require("../helpers/factories")
const getDims = async (key, props) => {
    if (key === "checkpoint" || key === "player") return { width: 64, height: 64 }
    const atlas = await atlasCache.get()
    console.log(factories[key])
    if (factories[key] && typeof factories[key].dims === "function" && props) {
        // if there is no prop, understand that it's getting called for a single sprite
        return factories[key].dims(props, atlas)
    }
    const dims = atlas[key]
    return dims.rotation === 90 ? { width: dims.height, height: dims.width } : dims
}

module.exports = getDims