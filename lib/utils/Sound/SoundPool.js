import Sound from "./index"

class SoundPool {
    constructor({ resource, start, end, size = 1 }) {
        this.resource = resource
        this.start = start
        this.duration = end - start
        this.instances = Array(size).fill(new Sound(resource))
    }
    play() {
        const freeInstance = this.instances.find(({ playing }) => !playing)
        if (freeInstance) {
            freeInstance.playSegment(this.start, this.duration)
            return
        }
        const newInstance = new Sound(this.resource)
        this.instances.push(newInstance)
        
        newInstance.playSegment(this.start, this.duration)
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