const getKeyCode = e => e.which || e.keyCode

class KeyControls {
    constructor(mappings) {
        this.mappings = mappings
        this.keys = { }
        for (const keyAlias in mappings) {
            const key = mappings[keyAlias]
            if (Array.isArray(key)) {
                for (const k of key) {
                    this.keys[k] = { pressed: false, held: false }
                }
                continue
            }
            this.keys[key] = { pressed: false, held: false }
        }
        this.keysArr = Object.values(this.keys)
        this.keysLen = this.keysArr.length

        document.addEventListener("keydown", e => {
            const keyCode = getKeyCode(e)
            const key = this.keys[keyCode]
            if (!!key) {
                key.held = true
                key.pressed = true
            }
        })

        document.addEventListener("keyup", e => {
            const keyCode = getKeyCode(e)
            const key = this.keys[keyCode]
            if (!!key) {
                key.held = false
            }
        })
    }
    get(keyAlias, attrib = "held") {
        const key = this.mappings[keyAlias]
        if (Array.isArray(key)) {
            return key.find(code => this.keys[code][attrib] === true)
        }
        return this.keys[key][attrib]
    }
    reset() {
        for (let i = this.keysLen; i > -1; i--) {
            this.keysArr[i].pressed = false
        }
    }
}

export default KeyControls