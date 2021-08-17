import Viewport  from "@utils/ViewPort"

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
const resolution = isMobile ? { max: 1280, min: 720 }: { max: 1920, min: 1080 }
const aspect = resolution.max / resolution.min
const computeViewport = () => {
    const width = window.innerWidth, height = window.innerHeight
    const portraitMode = height > width
    const maxWidth = portraitMode ? resolution.min: resolution.max
    const maxHeight = portraitMode ? resolution.max: resolution.min
    const vpWidth = Math.min(width, maxWidth)
    const vpHeight = Math.min(height, maxHeight)
    return ({
        width: vpWidth,
        height: vpHeight,
    })
}

export default Object.freeze({
    viewport: new Viewport(computeViewport),
    worldWidth: 1000,
    worldHeight: window.innerHeight,
    gravity: 1700,
    isMobile
})