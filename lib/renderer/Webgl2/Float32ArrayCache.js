class Float32ArrayCache {
    constructor() {
        // Object to store pools by array size
        this.pools = {};

        // Object to store indices for round-robin selection for each size
        this.indices = {};
    }

    // Initialize a pool for a specific size with 3 Float32Arrays by default
    _initializePool(size, poolSize = 3) {
        if (!this.pools[size]) {
            this.pools[size] = [];
            this.indices[size] = 0; // Initialize round-robin index

            for (let i = 0; i < poolSize; i++) {
                this.pools[size].push(new Float32Array(size));
            }
        }
    }

    // Get a Float32Array from the pool and set the values from a JavaScript array
    get(array) {
        const size = array.length;

        // Ensure the pool for this size exists
        this._initializePool(size);

        // Get the pool for the specific size
        const pool = this.pools[size];

        // Round-robin selection
        const index = this.indices[size];
        const float32Array = pool[index];

        // Update the round-robin index for next time
        this.indices[size] = (index + 1) % pool.length;

        // Set the values from the provided array into the Float32Array
        float32Array.set(array);

        return float32Array;
    }
}

export default Float32ArrayCache