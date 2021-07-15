import Viewport  from "@utils/ViewPort"
import { clamp } from "@utils/math"

const computeViewport = () => ({ 
    width: clamp(300, 1200, window.innerWidth),
    height: Math.min(800, window.innerHeight)
})

export default Object.freeze({
    viewport: new Viewport(computeViewport),
    worldWidth: 1000,
    worldHeight: window.innerHeight,
    gravity: 1000
})