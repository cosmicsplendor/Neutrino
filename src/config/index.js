import Viewport  from "@utils/ViewPort"
import { clamp } from "@utils/math"

const computeViewport = () => ({ // spoorting resolution upto 1280 * 1280
    width: clamp(300, 1280, window.innerWidth),
    height: Math.min(1280, window.innerHeight)
})

export default Object.freeze({
    viewport: new Viewport(computeViewport),
    worldWidth: 1000,
    worldHeight: window.innerHeight,
    gravity: 1700,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})