export * as entity from "./entity"
export const startGameLoop = ({ mainUpdateFn, renderer }) => {
    const STEP = 100
    let lastTs = 0
    let dt = 0
    function loop(ts) {
        dt = Math.min(ts - lastTs, STEP) / 1000
        lastTs = ts

        renderer.scene.updateRecursively(dt)
        mainUpdateFn(dt)
        renderer.renderRecursively()
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
}