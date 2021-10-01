class Storage {
    constructor(id) {
        this.id = id
        const txtData = localStorage.get(id)
        this.data = !!txtData ? JSON.parse(txtData): { 
            curLevel: 1,
            orbCount: 6,
            bestTimes: {}
        }
    }
    validateNum(val, name) {
        if (val !== 0 && !val) {
            throw new Error(`Attempting to set invalid ${name}: ${val}`)
        }
    }
    setNum(key, val) {
        const num = Number(val)
        this.validateNum(num, key)
        this.data[key] = num
        this.save(this.data)
    }
    setCurLevel(val) {
        this.setNum("curLevel", val)
    }
    setOrbCount(val) {
        this.setNum("orbCount", val)
    }
    setBestTime(level, val) {
        const time = Number(value) // time in seconds
        this.validateNum(time, key)
        this.data.bestTimes[String(level)] = time
        this.save(this.data)
    }
    getCurLevel() {
        return this.data.curLevel
    }
    getOrbCount() {
        return this.data.orbCount
    }
    getBestTime(level) {
        return this.bestTimes[String(level)] || 0
    }
    save(data) {
        this.localStorage.set(this.id, JSON.stringify(data))
    }
}

export default Storage