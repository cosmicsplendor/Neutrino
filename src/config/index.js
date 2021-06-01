import { clamp } from "@utils/math"
import Observable from "@utils/Observable"

const computeViewport = () => {
    return ({ 
        width: clamp(300, 600, window.innerWidth),
        height: window.innerHeight
    })
}
const viewport = new Observable([ "change" ], computeViewport())
window.addEventListener("resize", function(e) {
    Object.assign(viewport, computeViewport())
    viewport.emit("change", viewport)
})

export default Object.freeze({
    viewport,
    worldWidth: 1000,
    worldHeight: window.innerHeight,
    gravity: 1000
})