import Sound from "./index"
const checkFree = sound => !sound.playing
class SoundPool {
    constructor({ resource, start, duration, size = 1, loop, volume, pan, speed }) {
        this.resource = resource
        this.start = start
        this.duration = duration
        this.instances = Array(size).fill(new Sound(resource, { loop, volume, pan, speed }))
    }
    play(volume) {
        const freeInstance = this.instances.find(checkFree)
        if (freeInstance) {
            freeInstance.play(this.start, this.duration, volume)
            return
        }
        const newInstance = new Sound(this.resource)
        this.instances.push(newInstance)
        
        newInstance.play(this.start, this.duration, volume)
    }
    pause() {
        this.instances.forEach(instance => {
            instance.pause()
        })
    }
    resume() {
        this.instances.forEach(instance => {
            instance.resume()
        })
    }
}

export default SoundPool