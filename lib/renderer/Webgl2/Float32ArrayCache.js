class Float32ArrayCache { // only cache the most common size
    constructor(arrSize) {
        this.arrSize = arrSize
        this.cached = new Float32Array(arrSize);
    }

    get(array) {
        this.cached.set(array)
        return this.cached
    }
}

export default Float32ArrayCache