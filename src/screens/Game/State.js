import Observable from "@lib/utils/Observable";

class State extends Observable {
    constructor() {
        super([ "pause", "suspend", "play" ])
    }
    pause() {
        this.emit("pause")
    }
    play() {
        this.emit("playing")
    }
    suspend() {
        this.emit("game-over")
    }
}

export default State