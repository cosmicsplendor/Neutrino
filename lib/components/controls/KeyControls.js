const getKeyCode = e => e.which || e.keyCode

class KeyControls {
    constructor(mappings) {
        this.mappings = mappings
        document.addEventListener("keydown", e => {
            const keyCode = getKeyCode(e)
            this[keyCode] = true
        })
        document.addEventListener("keyup", e => {
            const keyCode = getKeyCode(e)
            this[keyCode] = false
        })
    }
    get(key) {
        const keyCode = this.mappings[key]
        if (Array.isArray(keyCode)) {
            return keyCode.find(code => this[code] === true)
        }
        return this[keyCode]
    }
    update() { }
}

export default KeyControls