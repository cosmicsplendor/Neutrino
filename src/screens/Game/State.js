import Observable from "@lib/utils/Observable";

class State extends Observable {
    name = null
    constructor() {
        super([ "pause", "over", "play" ])
    }
    set(n) {
        this.name = n
    }
    is(n) {
        return n === this.name
    }
    pause() {
        if (this.is("paused")) return
        this.emit("pause")
        this.set("paused")
    }
    play() {
        if (this.is("playing")) return
        this.emit("play")
        this.set("playing")
    }
    over() {
        if (this.is("over")) return
        this.emit("over")
        this.set("over")
    }
    reset() {
        this.name = null
    }
}

export default State