class UI {
    constructor(query, root = document) {
        this.domNode = root.querySelector(query)
    }
    get(query) {
        return new UI(query, this.domNode)
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