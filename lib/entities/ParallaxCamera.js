import Camera from "./Camera"
class ParallaxCamera extends Camera {
    _layoutTiles = () => {}
    setWorld(worldWidth, worldHeight, baseline) {
        // contracting the dimensions by the factor of z-index
        let w = worldWidth / this.z 
        let h = worldHeight / this.z

        console.log({ w, h, worldWidth, worldHeight,  z: this.z })

        let entYOffset = 0

        const maxFy = baseline - this.subject.height / 2 // assuming the subject is restricted within baseline, calculating it's max y position
        if (worldHeight - maxFy >= this.bounds.height / 2) { // if world-camera is restrained vertically (not scrollable)
            entYOffset = (this.bounds.height / 2) * (this.z - 1) / this.z
            h += entYOffset
        } else {
            h += this.bounds.height / 2 // make sure the parallax camera too is scrollable vertically
            entYOffset = (this.bounds.height / 2 ) * (this.z - 1) / this.z
        }
        this.rExt = (this.bounds.width / 2) * (this.z - 1) / this.z
        this.lExt = - this.rExt
        this.world.width = w
        this.world.height = h
        this.children.forEach(child => {
            child.pos.y = (baseline / this.z) - (baseline - child.pos.y) + entYOffset
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