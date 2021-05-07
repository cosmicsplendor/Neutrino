import Observable from "./Observable"
class Assets {
    constructor() {


        const subject = new Observable([ "progress", "load", "error" ])
        Object.assign(this, subject)
    }
}

export default Assets