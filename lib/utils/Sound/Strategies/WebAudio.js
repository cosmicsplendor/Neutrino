class Sound {
    static ctx = new AudioContext()
    static decodeAudioData =  arrayBuffer => {
        return new Promise((resolve, reject) => {
            this.ctx.decodeAudioData(arrayBuffer, resolve, reject)
        })
    }
    static getBufferNodeStartFn(node) {
        return (startTime, from, duration) => {
            if (node.loop) {
                node.loopStart = from
                node.loopEnd = from + duration
                return node.start(startTime, from)
            }
            node.start(startTime, from, duration)
        }
    }
    constructor(buffer) {
        const { ctx } = Sound
        // initializing core props
        this.buffer = buffer
        this.panNode = ctx.createStereoPanner()
        this.volumeNode = ctx.createGain()

        // initializing settings
        this.panNode.pan.value = 0
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
        this.offset = this.loop ? newOffset % duration: Math.min(newOffset, duration)
        this.playing = false
        this.__stop()
        return this
    }
    resume() {
        if (this.playing) { return }
        const { playedFrom, offset, playTill } = this
        this.__play(playedFrom + offset, playTill)
        this.playing = true
        return this
    }
    playSegment(from, duration) { 
        this.playedFrom = from // starting point
        this.offset = 0 // marker between starting point and endpoint, which indicates playing progress
        this.playTill = from + duration // end point
        this.__play(from, duration)
        this.playing = true
        return this
    }
    play() { 
        this.playSegment(0, this.buffer.duration)
        return this
    }
    set loop(val) {
        const { sourceNode, playedFrom, playTill, lastPlayedAt } = this
        this.opts.loop = val
        if(!sourceNode) return
        sourceNode.loop = val
        if (val === true) {
            sourceNode.loopStart = playedFrom
            sourceNode.loopEnd = playTill
        } else if (this.playing) {
            const duration = playTill - playedFrom
            const elapsed = Sound.ctx.currentTime - lastPlayedAt
            const progress = elapsed % duration
            const timeTillEnd = duration - progress

            setTimeout(() => { // scheduele the sound to stop playing once it reaches designated end
                if (this.opts.loop === false) { // unless the loop has been turned back on again
                    sourceNode.stop(0)
                }
            }, timeTillEnd * 1000)
        }
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
    __play(from, duration) {
        if (this.playing) { this.__stop() }

        const { buffer, panNode, volumeNode, opts: { loop, speed } } = this
        const { ctx } = Sound
        const sourceNode = ctx.createBufferSource()
        const startSourceNode = Sound.getBufferNodeStartFn(sourceNode)
        this.sourceNode = sourceNode
        this.lastPlayedAt = ctx.currentTime
        
        sourceNode.buffer = buffer
        sourceNode.loop = loop
        sourceNode.playbackRate.value = speed

        sourceNode.connect(panNode)
        panNode.connect(volumeNode)
        volumeNode.connect(ctx.destination)

        startSourceNode(ctx.currentTime, from, duration)
    }
}

const loadAudioBuffer = src => {
    return new Promise((resolve, reject) => {
        fetch(src)
            .then(res => res.arrayBuffer())
            .then(arrayBuffer => Sound.decodeAudioData(arrayBuffer))
            .then(audioBuffer => resolve(audioBuffer))
            .catch(reject)
    })
}

export { loadAudioBuffer }
export default Sound