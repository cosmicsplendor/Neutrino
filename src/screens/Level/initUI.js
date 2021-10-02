import levels from "@config/levels"
import imgBtn from "@screens/ui/imgBtn"
import "./style.css"

const PREV = "prev-btn"
const NEXT = "next-btn"
const START = "start-btn"

const render = (images, level, levels) => {
    return `
        ${imgBtn(PREV, images.arrow)}
        ${imgBtn(NEXT, images.arrow)}
        ${imgBtn(START, images.resume)}
    `
}

export default ({ onStart, uiRoot, curLevel, levels, images }) => {
    let level = curLevel
    uiRoot.content = render(images, curLevel, levels)
    return () => {
        uiRoot.clear()
    }
}