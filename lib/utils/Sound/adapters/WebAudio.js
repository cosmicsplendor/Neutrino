class Sound {
    constructor(buffer) {
        const ctx = new AudioContext()
        // initializing core props
        this.ctx = ctx
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
        const timeSinceLastPlayed = this.ctx.currentTime - this.lastPlayedAt
        const newOffset = this.offset + timeSinceLastPlayed
        const duration = this.playTill - this.playedFrom
        this.offset = this.loop ? newOffset % duration: Math.max(newOffset, duration)
        this.playing = false
    }
    play() {
        if (this.playing) { return }
        const { startedFrom, offset, playTill } = this
        this.__play(startedFrom + offset, playTill)
        this.playing = true
    }
    playSegment(from, to) { 
        this.playedFrom = from // starting point
        this.offset = 0 // marker between starting point and endpoint, which indicates playing progress
        this.playTill = to // end point
        this.__play(from, to)
        this.playing = true
    }
    restart() { 
        this.playSegment(0, this.buffer.duration)
    }
    set loop(val) {
        this.opts.loop = val
        this.sourceNode.loop.setValueAtTime(val, this.ctx.currentTime)
    }
    set speed(val) {
        this.opts.speed = val
        this.sourceNode.playbackRate.setValueAtTime(val, this.ctx.currentTime)
    }
    set volume(val) {
        this.volumeNode.gain.setValueAtTime(val / 100, this.ctx.currentTime)
    }
    set pan(val) {
        this.panNode.pan.setValueAtTime(val, this.ctx.currentTime)
    }
    __stop() {
        const { sourceNode, ctx: { currentTime } } = this
        sourceNode && sourceNode.stop(currentTime)
    }
    __play(from, to) {
        if (this.playing) { this.__stop() }

        const { ctx, buffer, panNode, volumeNode, opts: { loop, speed } } = this
        const sourceNode = ctx.createBufferSource()
        this.sourceNode = sourceNode
        this.lastPlayedAt = ctx.currentTime

        sourceNode.loop = loop
        sourceNode.playbackRate.value = speed

        sourceNode.connect(panNode)
        panNode.connect(volumeNode)
        volumeNode.connect(ctx.destination)

        sourceNode.start(ctx.currentTime, from, to ? to - from: buffer.duration)
    }
}