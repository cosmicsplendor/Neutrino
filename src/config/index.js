import Viewport  from "@utils/ViewPort"

const resolutions = {
    mini: { max: 600, min: 350 },
    mobile: { max: 1280, min: 720 },
    desktop: { max: 1920, min: 1080 },
    // desktop: { max: 1280, min: 720 },
    desktop: { max: 1000, min: 750 },
    mobile: { max: 800, min: 600 },
}

// the following three are config variables 
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
const resolution = isMobile ? resolutions.mobile: resolutions.desktop
const scale = false
const computeViewport = () => {
    const width = window.innerWidth, height = window.innerHeight
    const portraitMode = height > width
    const maxWidth = portraitMode ? resolution.min: resolution.max
    const maxHeight = portraitMode ? resolution.max: resolution.min
    const vpWidth = Math.min(width, maxWidth)
    const vpHeight = Math.min(height, maxHeight)
    const scaleX = width / vpWidth// by what factor to scale the viewport width so that it fits the screen
    const scaleY = height / vpHeight
    return ({
        width: vpWidth,
        height: vpHeight,
        scale: scale ? Math.min(scaleX, scaleY): 1
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
    resolution,
})