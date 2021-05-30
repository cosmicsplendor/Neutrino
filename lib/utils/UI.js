class UI {
    constructor(query, root = document) {
        this.root = root.querySelector(query)
    }
    get(query) {
        return new UI(query, this.root)
    }
    get classList() {
        return this.root.classList
    }
    set pos({ x, y }) {
        this.root.style.left = `${x}px`
        this.root.style.top = `${y}px`
    }
    get bounds() {
        return this.root.getBoundingClientRect()
    }
    set content(html) {
        this.root.innerHTML = html
    }
    clear() {
        this.content = ""
    }
    on(event, callback) {
        this.root.addEventListener(event, callback)
    }
    off(event, callback) {
        this.root.removeEventListener(event, callback)
    }
    add(el) {
        this.root.addpendChild(el)
    }
}

export default UI