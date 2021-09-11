import { IMatrix } from "./Matrix"
const createEmptyState = () => ({
    blendMode: null,
    alpha: 1,
    mat: [],
    tint: null,
    overlay: null
})
class StateStack { 
    /**
     * global transform and alpha compositing states for renderer
     * behaves like stack, but isn't for sake of performance
     */
    constructor() {
        this._stack = []
        this._stack.push({ // default state
            blendMode: "source-over",
            alpha: 1,
            mat: IMatrix.create(),
            tint: null,
            overlay: null
        })
        this.activeIdx = 0
        this.active = this._stack[0]
        this.first = this._stack[0]
    }
    save() {
        this.activeIdx += 1
        this._stack[this.activeIdx] =  this._stack[this.activeIdx] || createEmptyState()
        this.active = this._stack[this.activeIdx]
        // copying previous state into the current one (can be interpreted as pushing a previous state into the stack)
        const prev = this._stack[this.activeIdx - 1]
        this.active.blendMode = prev.blendMode
        this.active.alpha = prev.alpha
        this.active.tint = prev.tint
        this.active.overlay = prev.overlay
        for (let i = 0; i < 9; i++) {
            this.active.mat[i] = prev.mat[i]
        }
    }
    restore() {
        if (this.activeIdx === 0) {
            throw new Error("couldn't restore state: no save point could be found")
        }
        // unwinding the state (popping the stack)
        this.activeIdx -= 1
        this.active = this._stack[this.activeIdx]
    }
}

export default StateStack