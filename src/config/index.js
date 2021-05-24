import { clamp } from "@utils/math"
const config = Object.freeze({
    viewport: Object.freeze({
        width: clamp(300, 500, window.innerWidth / 2),
        height: window.innerHeight
    }),
    worldWidth: 1000,
    worldHeight: window.innerHeight,
    gravity: 1000
})

export default config