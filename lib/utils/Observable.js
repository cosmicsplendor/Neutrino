export default class Observable {
    events = {}
    subscribe(event, callback) {
        if (!this.events[event]) {
            throw new Error(`attempting to listen to an unknown event: "${event}"`)
        }
        this.events[event].push(callback)
    }
    unsubscribe(event, callback) {
        this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
    dispatch(event, ...params) {
        const subscribers = this.events[event]
        subscribers.forEach(callback => callback(...params))
    }
}