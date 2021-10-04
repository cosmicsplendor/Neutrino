import Observable from "@lib/utils/Observable";

class State extends Observable {
    name = "playing"
    constructor() {
        super([ "pause", "suspend", "play" ])
    }
    is(n) {
        return n === this.name
    }
    pause() {
        this.emit("pause")
        this.name = "paused"
    }
    play() {
        this.emit("play")
        this.name = "playing"
    }
    suspend() {
        this.emit("suspend")
        this.name = "suspended"
    }
}

export default State