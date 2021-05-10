
class Sound {
    static ctx = new AudioContext()
    static decodeAudioData =  arrayBuffer => {
        return new Promise((resolve, reject) => {
            this.ctx.decodeAudioData(arrayBuffer, resolve, reject)
        })
    }
    constructor(buffer) {
        const { ctx } = Sound
        // initializing core props
        this.buffer = buffer
        this.panNode = ctx.createStereoPanner()
        this.volumeNode = ctx.createGain()

        // initializing settings
        this.panNode.pan.value = -1
        this.volumeNode.gain.value = 1
        this.opts = {
            speed: 1,
            loop: false
        }

        // initializing state variables
        this.playedFrom = 0 // starting point of the current play session
        this.offset = 0 // marker between starting and end points indicating playing progress
        this.playTill = this.buffer.duration // end point of the current play session
        this.lastPlayedAt = 0 // last time the play method was invoked
        this.playing = false // the sound starts off paused
    }
    pause() {
        if (!this.playing) { return }
        const timeSinceLastPlayed = Sound.ctx.currentTime - this.lastPlayedAt
        const newOffset = this.offset + timeSinceLastPlayed
        const duration = this.playTill - this.playedFrom
        this.offset = this.loop ? newOffset % duration: Math.max(newOffset, duration)
        this.playing = false
    }
    resume() {
        if (this.playing) { return }
        const { playedFrom, offset, playTill } = this
        this.__play(playedFrom + offset, playTill)
        this.playing = true
    }
    playSegment(from, to) { 
        this.playedFrom = from // starting point
        this.offset = 0 // marker between starting point and endpoint, which indicates playing progress
        this.playTill = to // end point
        this.__play(from, to)
        this.playing = true
    }
    play() { 
        this.playSegment(0, this.buffer.duration)
    }
    set loop(val) {
        this.opts.loop = val
        this.sourceNode.loop = val
    }
    set speed(val) {
        this.opts.speed = val
        this.sourceNode.playbackRate.setValueAtTime(val, 0)
    }
    set volume(val) {
        this.volumeNode.gain.setValueAtTime(val / 100, 0)
    }
    set pan(val) {
        this.panNode.pan.setValueAtTime(val, 0)
    }
    __stop() {
        const { sourceNode  } = this
        sourceNode && sourceNode.stop(0)
    }
    __play(from, to) {
        if (this.playing) { this.__stop() }

        const { buffer, panNode, volumeNode, opts: { loop, speed } } = this
        const { ctx } = Sound
        const sourceNode = ctx.createBufferSource()
        this.sourceNode = sourceNode
        this.lastPlayedAt = ctx.currentTime

        sourceNode.buffer = buffer
        sourceNode.loop = loop
        sourceNode.playbackRate.value = speed

        sourceNode.connect(panNode)
        panNode.connect(volumeNode)
        volumeNode.connect(ctx.destination)

        sourceNode.start(ctx.currentTime, from, to)
    }
}

const loadAudioBuffer = async src => {
    const res = await fetch(src)
    const arrayBuffer = await res.arrayBuffer()
    const audioBuffer = await Sound.decodeAudioData(arrayBuffer)
    return audioBuffer
}

export { loadAudioBuffer }
export default Sound