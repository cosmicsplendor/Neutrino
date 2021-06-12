import Viewport  from "@utils/ViewPort"
import { clamp } from "@utils/math"

const computeViewport = () => ({ 
    width: clamp(300, 600, window.innerWidth),
    height: window.innerHeight
})

export default Object.freeze({
    viewport: new Viewport(computeViewport),
    worldWidth: 1000,
    worldHeight: window.innerHeight,
    gravity: 1000
})