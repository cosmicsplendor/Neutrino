import Observable from "@utils/Observable"

class Viewport extends Observable {
    constructor(computeViewport) {
        super([ "change" ], computeViewport())
        window.addEventListener("resize", function(e) {
            const newDimensions = computeViewport()
            Object.assign(this, newDimensions)
            this.emit("change", newDimensions)
        })
    }
}

export default Viewport