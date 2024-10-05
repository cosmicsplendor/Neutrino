const { calcAligned, convertToWorld, getDims } = require("../utils/index.js");
const atlasCache = require("./atlasCache");
const factories = require("./factories");

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
    align,
    alignmentMap,
    validAlignments: Object.keys(alignmentMap)
}