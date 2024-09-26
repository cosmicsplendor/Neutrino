class Float32ArrayCache {
    constructor() {
        // Object to store a single Float32Array per array size
        this.cache = {};
    }

    // Get a Float32Array from the cache or create a new one if it doesn't exist
    get(array) {
        // if (Math.random()<0.001) console.log(`${this.constructor.name} CACHE SIZE: ${Math.floor(JSON.stringify(this).length * 2 / 1000)} KB`)
        const size = array.length;

        // Check if there's already a cached Float32Array for this size
        if (!this.cache[size]) {
            // If not, create a new Float32Array and store it in the cache
            this.cache[size] = new Float32Array(size);
        }

        // Get the cached Float32Array
        const float32Array = this.cache[size];

        // Set the values from the provided array into the cached Float32Array
        float32Array.set(array);

        return float32Array;
    }
}

export default Float32ArrayCache