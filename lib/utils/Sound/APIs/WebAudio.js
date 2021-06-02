const ctx = new AudioContext()

const decodeAudioData =  arrayBuffer => {
    return new Promise((resolve, reject) => {
        ctx.decodeAudioData(arrayBuffer, resolve, reject)
    })
}

const getBufferNodeStartFn = node => {
    return (startTime, from, duration) => {
        if (node.loop) {
            node.loopStart = from
            node.loopEnd = from + duration
            return node.start(startTime, from)
        }
        node.start(startTime, from, duration)
    }
}

class Sound {
    static loadResource = src => {
        return new Promise((resolve, reject) => {
            fetch(src)
                .then(res => res.arrayBuffer())
                .then(arrayBuffer => decodeAudioData(arrayBuffer))
                .then(audioBuffer => resolve(audioBuffer))
                .catch(reject)
        })
    }
    constructor(buffer) {
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
        this.playTill = buffer.duration // end point of the current play session
        this.lastPlayedAt = 0 // last time the play method was invoked
        this.playing = false // the sound starts off paused
    }
    pause() {
        if (!this.playing) { return }
        const timeSinceLastPlayed = ctx.currentTime - this.lastPlayedAt
        const newOffset = this.offset + timeSinceLastPlayed
        const duration = this.playTill - this.playedFrom
        this.offset = this.loop ? newOffset % duration: Math.min(newOffset, duration)
        this._stop()
    }
    resume() {
        if (this.playing) { return }
        const { playedFrom, offset, playTill } = this
        this._play(playedFrom + offset, playTill)
    }
    playSegment(from, duration) { 
        if (this.playing) { return }
        this.playedFrom = from // starting point
        this.offset = 0 // marker between starting point and endpoint, which indicates playing progress
        this.playTill = from + duration // end point
        this._play(from, duration)
    }
    play() { 
        this.playSegment(0, this.buffer.duration)
    }
    set loop(val) {
        const { sourceNode, playedFrom, playTill, lastPlayedAt } = this
        this.opts.loop = val
        if(!sourceNode) { return }
        sourceNode.loop = val
        if (val === true) {
            sourceNode.loopStart = playedFrom
            sourceNode.loopEnd = playTill
            return
        } 
        if (this.playing) {
            const duration = playTill - playedFrom
            const elapsed = ctx.currentTime - lastPlayedAt
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
    _stop() {
        const { sourceNode  } = this
        sourceNode && sourceNode.stop(0)
    }
    _play(from, duration) {
        const { buffer, panNode, volumeNode, opts: { loop, speed } } = this
        const sourceNode = ctx.createBufferSource()
        const startSourceNode = getBufferNodeStartFn(sourceNode)
        this.sourceNode = sourceNode
        this.lastPlayedAt = ctx.currentTime
        
        sourceNode.buffer = buffer
        sourceNode.loop = loop
        sourceNode.playbackRate.value = speed

        sourceNode.connect(panNode)
        panNode.connect(volumeNode)
        volumeNode.connect(ctx.destination)

        startSourceNode(ctx.currentTime, from, duration)

        sourceNode.onended = () => {
            this.playing = false
        }
        this.playing = true
    }
}

export default Sound