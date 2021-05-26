function playSound() {
    const actx = new AudioContext()
    const xhr = new XMLHttpRequest()
    xhr.open("GET", "http://localhost:3000/images/bcce8c4886246e233e6b746f14b7ba31.wav")
    xhr.responseType = "arraybuffer"
    xhr.addEventListener("load", e => {
        actx.decodeAudioData(e.target.response, buffer => {
            const soundNode = actx.createBufferSource()
            const volumeNode = actx.createGain()
            const panNode = actx.createStereoPanner()
            const delayNode = actx.createDelay()
            const feedbackNode = actx.createGain()
            const biquadFilterNode = actx.createBiquadFilter()

            delayNode.delayTime.value = 0.3
            feedbackNode.gain.value = 0.7
            biquadFilterNode.frequency.value = 900
            soundNode.buffer = buffer
            soundNode.loop = false
            volumeNode.gain.value = 1
            panNode.pan.value = -1

            delayNode.connect(feedbackNode)
            feedbackNode.connect(biquadFilterNode)
            biquadFilterNode.connect(delayNode)

            soundNode.connect(volumeNode)
            volumeNode.connect(panNode)
            panNode.connect(actx.destination)

            soundNode.connect(delayNode)
            delayNode.connect(actx.destination)

            soundNode.start(0)
        })
    })
    xhr.send()
}

function impulseResponse({ duration=2, decay=2, reverse=false, actx }) {
    const length = duration * actx.sampleRate
    const impulse = actx.createBuffer(2, length, actx.sampleRate)
    const left = impulse.getChannelData(0)
    const right  = impulse.getChannelData(1)
    
    for (let i = 0; i < length; i++) {
        const n = reverse ? length -1 - i: i

        left[i] = right[i] = (Math.random() * 2 - 1) * Math.pow((1 - n / length), decay)
    }

    return impulse
}

function playReverb() {
    const actx = new AudioContext()
    const xhr = new XMLHttpRequest()
    xhr.open("GET", "http://localhost:3000/images/bcce8c4886246e233e6b746f14b7ba31.wav")
    xhr.responseType = "arraybuffer"
    xhr.addEventListener("load", e => {
        actx.decodeAudioData(e.target.response, buffer => {
            const soundNode = actx.createBufferSource()
            const volumeNode = actx.createGain()
            const panNode = actx.createStereoPanner()
            const convolverNode = actx.createConvolver()

            soundNode.buffer = buffer
            soundNode.loop = false
            volumeNode.gain.value = 1
            panNode.pan.value = 0
            convolverNode.buffer = impulseResponse({ actx, reverse: true })

            soundNode.connect(volumeNode)
            volumeNode.connect(panNode)
            panNode.connect(convolverNode)
            convolverNode.connect(actx.destination)

            soundNode.start(0)
        })
    })
    xhr.send()
}

class Paused {
    constructor(sound) {
        super(sound)
    }
    play() {
        // playI
        this.sound.state = this.sound.states.playing
    }
    pause() {
        // do nothing
    }
}

class Playing {
    constructor(sound) {
        this.sound = sound
        super(sound)
    }
    play() {
        // do nothing
    }
    pause() {
        // pause
        this.sound.state = this.sound.states.paused
    }
}


class Sound {
    constructor() {
        this.states = {
            playing: new PlayingState(this),
            paused: new PausedState(this)
        }
        this.state = this.states.paused
    }
    play() {
        this.state.play()
    }
    pause() {
        this.state.pause()
    }
}
