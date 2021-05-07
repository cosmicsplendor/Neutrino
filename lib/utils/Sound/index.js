const decodeAudioData = (ctx, arrayBuffer) => new Promise((resolve, reject) => {
    ctx.decodeAudioData(arrayBuffer, buffer => resolve(buffer), error => reject(error))
})

class Sound {
    startTime = 0
    startOffset = 0
    sourceNode = null
    playing = false
    loop = false
    pan = 0
    volume = 1
    speed = 1
    constructor(src, onLoad = () => {}, onError = () => {}) {
        const ctx = new AudioContext()
        this.panNode = ctx.createStereoPanner()
        this.volumeNode = ctx.createGain()
        this.ctx = ctx


        this.onLoad = onLoad
        this.onError = onError

        this.load(src).then(audioBuffer => {
            this.buffer = audioBuffer
            this.onLoad()
        }).catch(error => this.onError(error))
    }
    async load(src) {
        const response = await fetch(src)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await decodeAudioData(this.ctx, arrayBuffer)

        return audioBuffer
    }
    play(overrides = {}) {
        if (this.playing) return

        const { ctx, panNode, volumeNode, buffer,startOffset } = this
        const sourceNode = ctx.createBufferSource()
        const now = ctx.currentTime
        this.startTime = now
        this.sourceNode = sourceNode
        this.playing = true

        sourceNode.buffer = buffer
        sourceNode.loop = overrides.loop || this.loop
        panNode.pan.value = overrides.pan || this.pan
        volumeNode.gain.value = overrides.volume || this.volume
        
        sourceNode.connect(volumeNode)
        volumeNode.connect(panNode)
        panNode.connect(ctx.destination)
        

        sourceNode.start(now, startOffset % buffer.duration)
    }
    pause() {
        if (!this.playing) return

        const { ctx, sourceNode, startTime } = this
        this.startOffset += ctx.currentTime - startTime 
        this.playing = false

        sourceNode.stop(ctx.currentTime)
    }
    start() {
        if (this.playing) {
            this.sourceNode.stop(this.ctx.currentTime)
        }
        this.startOffset = 0
        this.play()
    }
    set pan(val) {
        this.pan = this.panNode.pan.value = val
    }
    set volume(val) {
        this.volume = this.volumeNode.gain.value = val
    }
    set loop(val) {
        this.loop = val
        this.sourceNode && (this.sourceNode.loop = val)
    }
    set speed(val) {
        this.speed = this.sourceNode.playbackRate.value = val
    }
}

export default Sound