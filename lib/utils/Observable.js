export default class Observable {
    constructor(events = []) {
        this.events = events.reduce((events, event) => {
            events[event] = []
            return events
        }, {})
    }
    subscribe(event, callback) {
        if (!this.events[event]) {
            throw new Error(`attempting to listen to an unknown event: "${event}"`)
        }
        this.events[event].push(callback)
    }
    subscribeOnce(event, callback) {
        callback.once = true
        this.subscribe(event, callback)
    }
    unsubscribe(event, callback) {
        this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
    dispatch(event, ...params) {
        if (!this.events[event]) {
            throw new Error(`attempting to dispatch non-existent event: ${event}. Events have to be defined upfront`)
        }
        const subscribers = [...this.events[event]]
        subscribers.forEach(callback => {
            callback(...params)
            if (callback.once) {
                this.unsubscribe(event, callback)
            }
        })
    }
}