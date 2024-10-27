import { randf, rand } from "@lib/utils/math"

class Ambience { // StateMachine
    constructor(graph, soundMap, initialNode, initialSilence=0) {
        this.graph = graph
        this.soundMap = soundMap
        this.states = {
            "playing": new Playing(this),
            "silence": new Silence(this, graph)
        }
        this.initialNode = initialNode
        this.initialSilence = initialSilence
    }
    update(dt) {
        this.state && this.state.update(dt)
    }
    getSound(name) {
        return this.soundMap[name]
    }
    getNextNode(curNode) {
        const { node, edge } = this.graph.getNext(curNode)
        const silence = Array.isArray(edge.silence)? randf(edge.silence[1], edge.silence[0]): edge.silence
        return { nextNode: node, silence }
    }
    getNodeInfo(node) {
        const sound = this.soundMap[node.name]
        const loops = (Array.isArray(node.loop) ? rand(node.loop[1], node.loop[0]): node.loop)
        return { sound, loops }
    }
    switchState(name, ...props) {
        this.state = this.states[name]
        this.state.onEnter(...props)
    }
    init() {
        this.switchState("silence", { nextNode: this.graph.get(this.initialNode), silence: this.initialSilence })
    }
    terminate() {
        if (this.state !== this.states.playing) {
            return
        }
        this.states.playing.sound.pause()
        this.state = null
    }
}

class Silence {
    constructor(ambience) {
        this.ambience = ambience
    }
    onEnter(props) {
        const { nextNode, silence } = props
        this.t = silence
        this.nextNode = nextNode
    }
    update(dt) {
        this.t -= dt
        if (this.t < 0) {
            this.ambience.switchState("playing", this.nextNode)
        }
    }
}

class Playing {
    constructor(ambience) {
        this.ambience = ambience
    }
    onEnter(node) {
        this.node = node
        const { sound, loops } = this.ambience.getNodeInfo(node)
        this.loops = loops
        this.sound = sound
        this.sound.play()
    }
    onExit() {

    }
    update(dt) {
        if (this.sound.playing) return
        // the current sound has finished playing
        if (this.loops < 1) {
            this.ambience.switchState("silence", this.ambience.getNextNode(this.node))
            return
        }
        this.loops--
        this.sound.play()
    }
}

export default Ambience