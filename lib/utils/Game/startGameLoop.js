import { Node } from "@lib"
const startGameLoop = ({ mainUpdateFn=() => {}, renderer, step = 100 }) => {
    const STEP = step // max frame duration
    const RENDER_FPS = 40
    const RENDER_INTERVAL = 1000 / RENDER_FPS
    let lastTs = 0, lastRendered = 0
    let speed = 1
    let paused = false
    
    function loop(ts) {
        // const dt = speed * Math.min(ts - lastTs, STEP) / 1000
        const dt = Math.min(ts - lastTs, STEP) / 1000
        const elapsedSinceLastRendered = ts - lastRendered
        const tsInSecs = ts / 1000
        lastTs = ts
        if (paused) { 
            return requestAnimationFrame(loop)
        }
        // if root scene has update method that's where recursive update should go (it is useful when we have multiple cameras, one for each parallax layer)
        renderer.scene.update ? renderer.scene.update(dt, tsInSecs) : Node.updateRecursively(renderer.scene, dt, tsInSecs, renderer.scene)
        mainUpdateFn(dt, tsInSecs)

        if (elapsedSinceLastRendered > RENDER_INTERVAL) {
            renderer.renderRecursively()
            lastRendered = ts - elapsedSinceLastRendered % RENDER_INTERVAL
        } else {
            lastRendered = ts - elapsedSinceLastRendered
        }

        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
    return {
        pause() { 
            paused = true
        },
        resume() { 
            paused = false  
        },
        setSpeed(val) { speed = val },
        get meta() {
            return {
                elapsed: lastTs / 1000
            }
        }
    }
}

export default startGameLoop

