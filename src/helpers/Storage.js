import Observable from "@lib/utils/Observable"

const castToNum = (val, errParam) => {
    const num = Number(val)
    if (num !== 0 && !num) {
        throw new Error(`Attempting to set invalid ${errParam}: ${val}`)
    }
    return num
}

class Storage extends Observable {
    constructor(id) {
        super([ "orb-update", "music-update", "sfx-update" ])
        this.id = id
        const txtData = localStorage.getItem(id)
        this.data = !!txtData ? JSON.parse(txtData): { 
            curLevel: 1,
            orbCount: 6,
            hiscores: {},
            music: true,
            sfx: true
        }
    }
    setNum(key, val) {
        const num = castToNum(val, key)
        this.data[key] = num
        this.save(this.data)
        return num
    }
    setCurLevel(val) {
        this.setNum("curLevel", val)
    }
    setOrbCount(val) {
        const num = this.setNum("orbCount", val)
        this.emit("orb-update", num)
    }
    setHiscore(level, val) {
        const time  = castToNum(val, "hiscore")
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
        return this.data.hiscores[String(level)]
    }
    getMusic() {
        return this.data.music
    }
    setMusic(val) {
        this.data.music = val
        this.emit("music-update", this.data.music)
        this.save(this.data)
    }
    getSfx() {
        return this.data.sfx
    }
    setSfx(val) {
        this.data.sfx = val
        this.emit("sfx-update", this.data.sfx)
        this.save(this.data)
    }
    save(data) {
        localStorage.setItem(this.id, JSON.stringify(data))
    }
}

export default Storage