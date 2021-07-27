import { clamp } from "@utils/math"
import Camera from "./Camera"
class ParallaxCamera extends Camera {
    _layoutTiles = () => {}
    intersects = null
    setWorld(worldWidth, worldHeight, baseline) {
        // contracting the dimensions by the factor of z-index
        // let w = Math.max(worldWidth / this.z , this.viewport.height)
        // let h = Math.max(this.viewport.height, worldHeight / this.z)
        const baselineToBtmBounds = Math.min(worldHeight - baseline, this.bounds.height / 2)


        const maxFy = baseline - this.subject.height / 2 // assuming the subject is restricted within baseline, calculating it's max y position
        const maxWoCamY = clamp(0, worldHeight - this.bounds.height, maxFy - this.bounds.height / 2) // max position of the world-layer camera
        const maxCamY = maxWoCamY * this.pF // max camera y-coordinates in this layer
        const bl = maxCamY + this.bounds.height - baselineToBtmBounds // baseline in this layer
        const entYOffset = baselineToBtmBounds * (this.z - 1) / this.z

        this.rExt = (this.bounds.width / 2) * (this.z - 1) / this.z
        this.world.width = worldWidth
        this.world.height = worldHeight
        this.children.forEach(child => {
            child.pos = {
                x: child.pos.x,
                y: bl - (baseline - child.pos.y) + entYOffset
            }
        })
    }
    layoutTiles(tiles, worldWidth, worldHeight) { // layout new tiles
        const baseline = tiles.reduce((acc, tile) => { // y-coordinates of the baseline where parallax entities stand (the max y-coordinate within which all the entities are bound)
            return Math.max(acc, tile.pos.y + tile.height)
        }, 0)
        // taking advantage of closure to avoid unnecessary state setups and dependencies
        this.viewport.off("change", this._layoutTiles) // remove previous listener from viewport observable, so that the camera can be reused across multiple levels
        this._layoutTiles =  () => { // re-layout the tiles
            this.children = tiles
            this.setWorld(worldWidth, worldHeight, baseline)
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