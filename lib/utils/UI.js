class UI {
    static query(q, root) {
        return new UI(null, q, root)
    }
    static create(el) {
        return new UI(document.createElement(el))
    }
    constructor(domNode, query, root = document) {
        this.domNode = domNode || root.querySelector(query)
        if (!this.domNode) {
            throw new Error("one or more invalid constructor parameters")
        }
    }
    get(query) {
        return UI.query(query, this.domNode)
    }
    get classList() {
        return this.domNode.classList
    }
    set pos({ x, y }) {
        if (x) { this.domNode.style.left = `${x}px` }
        if (y) { this.domNode.style.top = `${y}px` }
    }
    get bounds() {
        return this.domNode.getBoundingClientRect()
    }
    set content(html) {
        this.domNode.innerHTML = html
    }
    clear() {
        this.content = ""
    }
    on(event, callback) {
        this.domNode.addEventListener(event, callback)
    }
    off(event, callback) {
        this.domNode.removeEventListener(event, callback)
    }
    add(el) {
        this.domNode.addpendChild(el)
        return this
    }
}

export default UI