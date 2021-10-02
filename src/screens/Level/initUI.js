import config from "@config"
import "./style.css"
const imgBtn = (img, onClick, id) => {
    return `
    
    `
}
const render = (level, levels) => {
    return `

    `
}

export default ({ onStart, uiRoot, curLevel, levels }) => {
    uiRoot.content = render(curLevel, levels)
    return () => {
        uiRoot.clear()
    }
}