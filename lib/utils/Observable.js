class Observable {
    constructor(events = []) {
        this.events = events.reduce((events, event) => {
            events[event] = []
            return events
        }, {})
    }
    on(event, callback) {
        if (!this.events[event]) {
            throw new Error(`attempting to listen to an unknown event: "${event}"`)
        }
        this.events[event].push(callback)
    }
    once(event, callback) {
        callback.once = true
        this.subscribe(event, callback)
    }
    off(event, callback) {
        this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
    emit(event, ...params) {
        const subscribers = [...this.events[event]]
        subscribers.forEach(callback => {
            callback(...params)
            if (callback.once) {
                this.unsubscribe(event, callback)
            }
        })
    }
}

export default Observable