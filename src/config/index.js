import Viewport  from "@utils/ViewPort"
import GPix from "../helpers/sdk/strategies/GPix"
import LocStorage from "../helpers/storage/strategies/LocStorage"
import GPixStorage from "../helpers/storage/strategies/GPixStorage"

/**
 * config checklist:
 * 1. resolution
 * 2. storage strategy class
 * 3. sdk strategy class (null for none)
 */

const resolutions = {
    standard: { max: 1080, min: 750 }
}

const desktopRes = resolutions.standard

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
const scale = false
const maxDpr = 1
const maxMobileDpr = 1.5
const computeViewport = () => {
    const width = window.innerWidth, height = window.innerHeight // drawing buffer dimensions (how manny actual pixels are there in the screen regardless of scaling)
    const portraitMode = height > width
    if (isMobile) {
        /**
         * 100% of the smaller side
         * and max(100% of the smaller side, 70% of the bigger side)
         */
        const vpWidth = portraitMode ? width: Math.max(0.7 * width, height)
        const vpHeight = portraitMode ? Math.max(0.7 * height, width): height
        return ({
            width: vpWidth,
            height: vpHeight
        })
    }
    const maxWidth = portraitMode ? desktopRes.min: desktopRes.max
    const maxHeight = portraitMode ? desktopRes.max: desktopRes.min
    const vpWidth = Math.min(width, maxWidth)
    const vpHeight = Math.min(height, maxHeight)
    return ({ // canvas dimensions
        width: vpWidth,
        height: vpHeight,
    })
}

export default Object.freeze({
    viewport: new Viewport(computeViewport),
    storageId: "jshdf190",
    worldWidth: 1000,
    worldHeight: window.innerHeight,
    gravity: 1700,
    isMobile,
    scale,
    get devicePixelRatio() {
        return Math.min(isMobile ? maxMobileDpr: maxDpr, window.devicePixelRatio)
    },
    SDKStrat: null,
    StorageStrat: LocStorage,
    orientation: "portrait",
})