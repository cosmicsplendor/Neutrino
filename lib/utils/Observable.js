export default class Event {
    constructor(type) {
        this.type = type
        this.subscribers = []
    }
    subscribe(entity, callback) {
        this.subscribers.push({ entity, callback })
    }
    poll() {
        for (const subscriber of this.subscribers) {
            this.check(subscriber)
        }
    }
}