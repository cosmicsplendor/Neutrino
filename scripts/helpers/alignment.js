const { calcAligned, convertToWorld } = require("../utils");
const atlasCache = require("./atlasCache");
const factories = require("./factories");

const getDims = async key => {
    if (key === "checkpoint") return { width: 0, height: 0 }
    const atlas = await atlasCache.get()
    if (factories[key] && typeof factories[key].dims === "function") {
        console.log(factories[key].dims(atlas))
        console.log(atlas[key])
        return factories[key].dims(atlas)
    }
    const dims = atlas[key]
    return dims.rotation === 90 ? { width: dims.height, height: dims.width } : dims
}

const alignmentMap = {
    "top-left": ["left", "top"],
    "bottom-left": ["left", "bottom"],
    "top": ["center", "top"],
    "bottom": ["center", "bottom"],
    "top-right": ["right", "top"],
    "bottom-right": ["right", "bottom"],
    "center": ["center", "center"],
    "left": ["left", "center"],
    "right": ["right", "center"]
}

const align = async (name, projection, alignment, dx, dy) => {
    const factory = factories[name]
    const [alignX, alignY] = alignmentMap[alignment]
    const dims = await getDims(name)
    const aligned = calcAligned(convertToWorld(projection), { w: dims.width, h: dims.height }, alignX, alignY, dx, dy)
    return aligned
}

module.exports = {
    getDims,
    align,
    alignmentMap,
    validAlignments: Object.keys(alignmentMap)
}