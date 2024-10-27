import { randf } from "@lib/utils/math"
import { rand } from "scripts/utils"

class Ambience { // StateMachine
    constructor(sprite, graph, soundMap, initialNode, initialSilence=0) {
        this.sprite = sprite
        this.graph = graph
        this.soundMap = soundMap
        this.states = {
            "playing": new Playing(this),
            "silence": new Silence(this, graph)
        }
        initialSilence = initialSilence
        this.switchState("silence", { nextNode: graph.get(initialNode), silence: initialSilence })
    }
    update(dt) {
        this.state.update(dt)
    }
    getDuration(name) {
        return this.sprite[name]
    }
    getSound(name) {
        return this.soundMap[name]
    }
    getNextNode(curNode) {
        const { node, edge } = this.graph.getNextNode(curNode)
        const silence = Array.isArray(edge.silence)? randf(edge.silence[1], edge.silence[0]): silence
        return { nextNode: node, silence }
    }
    getNodeInfo(node) {
        const duration = this.sprite[node.name].duration
        const sound = this.soundMap[node.name]
        const loops = (Array.isArray(node.loop) ? rand(node.loop[1], node.loog[0]): node.loop)
        return { duration, sound, loops }
    }
}

class Silence {
    constructor(ambience) {
        this.ambience = ambience
    }
    onEnter({ nextNode, silence }) {
        this.t = silence
        this.nextNode = nextNode
    }
    update(dt) {
        this.t -= dt
        if (dt < 0) {
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
        const { duration, sound, loops } = this.ambience.getNodeInfo()
        this.duration = duration
        this.t = duration
        this.loops = loops
        sound.play()
    }
    onExit() {

    }
    update(dt) {
        this.t -= dt
        if (this.t > 0) return
        // the current countdown has finished
        if (this.loops === 0) {
            this.ambience.switchState("silence", this.ambience.getNextNode(this.node))
            return
        }
        this.loops--
        this.t = this.duration
    }
}

export default Ambience