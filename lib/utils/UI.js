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
        if (!this.domNode.getBoundingClientRect) {
            return
        }
        const { width, height } = this.domNode.getBoundingClientRect()
        this.x = 0
        this.y = 0
        this.width = width
        this.height = height
    }
    get(query) {
        return UI.query(query, this.domNode)
    }
    hide() {
        this.domNode.style.opacity = 0
    }
    show() {
        this.domNode.style.opacity = 1
    }
    get classList() {
        return this.domNode.classList
    }
    set pos({ x, y }) {
        if (x) { 
            this.x = x
            this.domNode.style.left = `${x}px`
        }
        if (y) {
            this.y = y
            this.domNode.style.top = `${y}px`
        }
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
        this.domNode.appendChild(el.domNode || el)
        return this
    }
}

export default UI