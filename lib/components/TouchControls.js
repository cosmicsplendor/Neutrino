class TouchControls {
    constructor(mappings) {
        // { axn: "query" }
        this.btns = { }
        mappings.forEach(btnAlias => {
            this.btns[btnAlias] = { pressed: false, held: false }
            const btnQuery = mappings[btnAlias]
            const btn = document.querySelector(btnQuery)
            btn.onclick = () => {
                const m = this.btns[btnAlias] // button meta
                m.pressed = true
                m.held = true
            }
            btn.onmouseup = () => {
                const m = this.btns[btnAlias] // button meta
                m.pressed = false
                m.held = false
            }
        })
        this.btnsArr = Object.values(this.btns)
        this.btnsLen = this.btnsArr.length
    }
    get(btnAlias, attrib = "held") {
        return this.btns[btnAlias][attrib]
    }
    reset() {
        for (let i = this.btnsLen; i > -1; i--) {
            this.btnsArr[i].pressed = false
        }
    }
}

export default TouchControls