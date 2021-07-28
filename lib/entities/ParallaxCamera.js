import { clamp } from "@utils/math"
import Camera from "./Camera"

class ParallaxCamera extends Camera {
    _layoutTiles = () => {}
    intersects = null
    constructor({ entYOffset = 0, ...rest }) {
        super({ ...rest })
        this.entYOffset = entYOffset
    }
    setWorld({ worldWidth, worldHeight, tiles, baseline }) { // this assumes that we only have two parallax backgrounds
        // in case baselineAtop is not undefined, it's assumed that this is the parallax-far-bg layer
        const baselineToBtmBounds = Math.min(worldHeight - baseline, (this.bounds.height - this.subject.height) / 2)


        const maxFy = baseline - this.subject.height / 2 // assuming the subject is restricted within baseline, calculating it's max y position
        const maxWoCamY = clamp(0, worldHeight - this.bounds.height, maxFy - this.bounds.height / 2) // max position of the world-layer camera
        const maxCamY = maxWoCamY * this.pF // max camera y-coordinates in this layer
        const bl = maxCamY + this.bounds.height - baselineToBtmBounds // baseline in this layer
        const blOffset = baselineToBtmBounds * (1 - 1 / this.z)

        this.world.width = worldWidth
        this.world.height = worldHeight
        this.children = tiles.map(child => {
            child.pos = {
                x: child.pos.x,
                y: (bl + blOffset) - (baseline - child.pos.y) + this.entYOffset
            }
            return child
        })
    }
    layoutTiles({ tiles, baseline, worldWidth, worldHeight }) { // layout new tiles

        // taking advantage of closure to avoid unnecessary state setups and dependencies
        this.viewport.off("change", this._layoutTiles) // remove previous listener from viewport observable, so that the camera can be reused across multiple levels
        this._layoutTiles =  () => { // re-layout the tiles
            this.setWorld({ worldWidth, worldHeight, tiles, baseline })
        }
        this.viewport.on("change", this._layoutTiles) // and attach a new one
        this._layoutTiles() // performing the actual (initial) work
    }
    onRemove() {
        super.onRemove()
        this.viewport.off("change", this._layoutTiles)
    }
}

export default ParallaxCamera