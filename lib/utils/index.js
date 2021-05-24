 const startGameLoop = ({ mainUpdateFn, renderer, step = 100 }) => {
    const STEP = step // max frame duration
    let lastTs = 0
    let dt = 0
    let speed = 1
    let paused = false
    
    function loop(ts) {
        dt = speed * Math.min(ts - lastTs, STEP) / 1000
        
        lastTs = ts
        if (paused) { return }
        renderer.scene.updateRecursively(dt)
        mainUpdateFn(dt)
        renderer.renderRecursively()
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
    return {
        pause() { paused = true },
        resume() { paused = false },
        setSpeed(val) { speed = val },
        get meta() {
            return {
                elapsed: lastTs
            }
        }
    }
}

export {
    startGameLoop
}