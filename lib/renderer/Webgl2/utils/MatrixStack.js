import { IMatrix } from "./Matrix"
class MatrixStack { 
    /**
     * behaves like stack, but isn't for sake of performance
     */
    constructor() {
        this._stack = []
        this._stack.push(IMatrix.create())
        this.activeIdx = 0
        this.active = this._stack[0]
        this.first = this._stack[0]
    }
    save() {
        this.activeIdx += 1
        this._stack[this.activeIdx] =  this._stack[this.activeIdx] || IMatrix.create()
        this.active = this._stack[this.activeIdx]
        // copying previous matrix into the current one (can be interpreted as cloneing the previous matrix and pushing it into the stack)
        const prev = this._stack[this.activeIdx - 1]
        for (let i = 0; i < 9; i++) {
            this.active[i] = prev[i]
        }
    }
    restore() {
        if (this.activeIdx === 0) {
            throw new Error("couldn't restore state: no save point could be found")
        }
        // unwinding the matrix (popping the stack)
        this.activeIdx -= 1
        this.active = this._stack[this.activeIdx]
    }
}

export default MatrixStack