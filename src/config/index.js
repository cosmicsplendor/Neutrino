import Viewport  from "@utils/ViewPort"

const desktopRes = {
    max: 1000, min: 750
}

// the following three are config variables 
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
const scale = false
const computeViewport = () => {
    const width = window.innerWidth, height = window.innerHeight
    const portraitMode = height > width
    console.log(isMobile)
    if (isMobile) {
        /**
         * 100% of the smaller side
         * and max(100% of the smaller side, 75% of the bigger side)
         */
        const vpWidth = portraitMode ? width: Math.max(0.75 * width, height)
        const vpHeight = portraitMode ? Math.max(0.75 * height, width): height
        console.log({ vpWidth, vpHeight })
        return ({
            width: vpWidth,
            height: vpHeight
        })
    }
    const maxWidth = portraitMode ? desktopRes.min: desktopRes.max
    const maxHeight = portraitMode ? desktopRes.max: desktopRes.min
    const vpWidth = Math.min(width, maxWidth)
    const vpHeight = Math.min(height, maxHeight)
    return ({
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
})