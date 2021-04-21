export class LinkedList {
    static createNode({ next, val }) {
        return { next, val  }
    }
    head = null
    tail = null
    static from(array) {

    }
    length = 0
    constructor() {

    }
    map(fn) {

    }
    filter(fn) {

    }
    forEach(fn) {

    }
    push(val) {
        const nodeToPush = LinkedList.createNode({ val })
        this.length++
        if (typeof this.head === "null") {
            this.head = this.tail = nodeToPush
            return
        }
        this.tail.next = nodeToPush
        this.tail = nodeToPush
    }
}