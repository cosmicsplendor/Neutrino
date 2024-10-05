const { getDims } = require("../utils")
const { alignmentMap } = require("./alignment")

const blades = [
    "sb1", "sb2", "sb3", "sb4", "sb5", "sb6"
]
const applyOffsets = async ({x, y}, name, alignment) => {
    if (blades.includes(name)) {
        const dims = await getDims(name)
        const [ xAlignment, yAlignment ] = alignmentMap[alignment]
        const halfWidth = dims.width * 0.5
        const halfHeight = dims.height * 0.5
        const dx = xAlignment === "left" ? -halfWidth: (xAlignment === "right" ? halfWidth: 0)
        const dy = yAlignment === "top" ? -halfHeight: (yAlignment === "bottom" ? halfHeight: 0)
        return { x: x + dx, y: y + dy }
    }
}

module.exports = applyOffsets