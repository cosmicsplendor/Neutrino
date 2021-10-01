const castToNum = (val, errParam) => {
    const num = Number(val)
    if (num !== 0 && !num) {
        throw new Error(`Attempting to set invalid ${errParam}: ${val}`)
    }
    return num
}
class Storage {
    constructor(id) {
        this.id = id
        const txtData = localStorage.get(id)
        this.data = !!txtData ? JSON.parse(txtData): { 
            curLevel: 1,
            orbCount: 6,
            hiscores: {}
        }
    }
    setNum(key, val) {
        const num = castToNum(val, key)
        this.data[key] = num
        this.save(this.data)
    }
    setCurLevel(val) {
        this.setNum("curLevel", val)
    }
    setOrbCount(val) {
        this.setNum("orbCount", val)
    }
    setHiscore(level, val) {
        const time  = castToNum(val, key)
        this.data.hiscores[String(level)] = time
        this.save(this.data)
    }
    getCurLevel() {
        return this.data.curLevel
    }
    getOrbCount() {
        return this.data.orbCount
    }
    getHiscore(level) {
        return this.hiscores[String(level)] || 0
    }
    save(data) {
        this.localStorage.set(this.id, JSON.stringify(data))
    }
}

export default Storage