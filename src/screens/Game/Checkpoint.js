class Checkpoint {
    savedCheckpoint = null
    constructor(checkpoints = []) {
        this.checkpoints = checkpoints.sort((a, b) => a.x - b.x) // sorting in ascending order of x-coordinates
        // this.savedCheckpoint = this.firstCheckpoint
    }
    get(x) {
        if (this.checkpoints.length === 0) return
        const cursoryCheckpoint = this.checkpoints.findLast(point => {
            return x >= point.x
        })
        const neither = !this.savedCheckpoint && !cursoryCheckpoint
        const onlySavedCheckpoint = !cursoryCheckpoint && this.savedCheckpoint
        const onlyCursoryCheckpoint = !this.savedCheckpoint && cursoryCheckpoint 
        if (neither) return undefined
        if (onlySavedCheckpoint) return this.savedCheckpoint
        if (onlyCursoryCheckpoint) {
            this.savedCheckpoint = cursoryCheckpoint
            return cursoryCheckpoint
        }
        // if both exist
        this.savedCheckpoint = this.savedCheckpoint.x > cursoryCheckpoint.x ? this.savedCheckpoint : cursoryCheckpoint
        return this.savedCheckpoint
    }
}

export default Checkpoint