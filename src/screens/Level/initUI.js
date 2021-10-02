import { calcAligned } from "@lib/utils/entity"
import config from "@config"
import levels from "@config/levels"
import imgBtn from "@screens/ui/imgBtn"
import styles from "./style.css"

const PREV = "prev-btn"
const NEXT = "next-btn"
const START = "start-btn"
const INFO = "lev-info"

const levelInfo = (level, levels) => {
    return `
        <div class="${styles.infoTitle}" id="${INFO}">${"Level " + level}</div>
    `
}
const render = (images, level, levels) => {
    return `
        ${imgBtn(PREV, images.arrow, styles.prevBtn)}
        ${levelInfo(level, levels)}
        ${imgBtn(NEXT, images.arrow)}
        ${imgBtn(START, images.resume)}
    `
}

export default ({ onStart, uiRoot, curLevel, images }) => {
    uiRoot.content = render(images, curLevel, levels)
    let levelState = curLevel

    const prevBtn = uiRoot.get(`#${PREV}`)
    const nextBtn = uiRoot.get(`#${NEXT}`)
    const startBtn = uiRoot.get(`#${START}`)
    const levelInfo = uiRoot.get(`#${INFO}`)

    const realign = viewport => {
        console.log(prevBtn.bounds)
        console.log(levelInfo.bounds)
        prevBtn.pos = calcAligned(viewport, prevBtn.bounds, "left", "center", 50)
        levelInfo.pos = calcAligned(viewport, levelInfo.bounds, "center", "center", 0, 0)
        nextBtn.pos = calcAligned(viewport, nextBtn.bounds, "right", "center", -50)
        startBtn.pos = calcAligned(viewport, startBtn.bounds, "center", "bottom", 0,  -100)
    }
    const onStartBtnClick = () => onStart(levelState)
    
    startBtn.on("click", onStartBtnClick)
    config.viewport.on("change", realign)
    realign(config.viewport)
    return () => {
        uiRoot.clear()
        config.viewport.off("change", realign)
        startBtn.off("click", onStartBtnClick)
    }
}