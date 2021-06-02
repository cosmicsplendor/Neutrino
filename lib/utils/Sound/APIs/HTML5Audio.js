
class Sound {
    static loadResource = src => {
        return new Promise((resolve, reject) => {
            const audio = new Audio(src)
            audio.onload = () => resolve(audio)
            audio.onerror = reject
        })
    }
    constructor(audio) {
        this.audio = audio.cloneNode()
        this.playing = false
        this.startedAt = 0
        this.prevTimeout = null
        this.startOffset = 0
        this.startedAt = 0
    }
    play(duration) {
        if (this.playing) return

        const { audio } = this

        
        if (this.prevTimeout) clearTimeout(this.prevTimeout)
        this.prevTimeout = duration ? setTimeout(audio.pause, duration * 1000): null
        
        this.startedAt = Date.now()
        this.playing = true
        audio.currentTime = this.startOffset % audio.duration
        audio.play()
    }
    playFrom(offset, duration) {
        const { audio } = this
        
        audio.pause()
        this.startOffset = offset
        this.play(duration)
    }
    pause() {
        if (!this.playing) return
        this.playing = false
        this.audio.pause()

        this.startOffset += Date.now - this.startedAt
    }
    restart() {
        const { audio } = this
        audio.pause()

        this.startOffset = 0
        this.play()
    }
    set volume(value) {
        this.audio.volume = value
     }
    set loop(value) { 
        this.audio.loop = value
    }
    set speed(value) { 
        this.audio.playbackRate = value
    }
}

export default Sound