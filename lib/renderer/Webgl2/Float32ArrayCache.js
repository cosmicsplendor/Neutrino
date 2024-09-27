class Float32ArrayCache { // only cache the most common size
    constructor(arrSize) {
        this.arrSize = arrSize
        this.cache = {};
        // this.logs = { miss: 0, hit: 0 }
    }

    get(array) {
        // if (Math.random()<0.0005) {
        //     console.log(`${this.constructor.name} CACHE SIZE: ${Math.floor(JSON.stringify(this).length * 2 / 1000)} KB`)
        //     console.log("Logs:", this.logs)
        // }
        const size = array.length;
        if (size !== this.arrSize) {
            this.logs.miss++
            return new Float32Array(array)
        }
        this.logs.hit++

        if (!this.cache[size]) {
            this.cache[size] = new Float32Array(array);
            return this.cache[size]
        }

        const float32Array = this.cache[size];
        float32Array.set(array);

        return float32Array;
    }
    // reset() {
    //     if(Math.random()<0.001) console.log("Logs:", this.logs)
    //     this.logs.miss = 0
    //     this.logs.hit = 0
    // }
}

export default Float32ArrayCache