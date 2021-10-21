import config from "@config"
import UI from "@lib/utils/UI"
import { calcAligned, calcStacked } from "@utils/entity"
import styles from "./style.css"

const progBarDims = {
    width: 150,
    height: 25
}

const INFO = "info"
const PROG_BAR = "prog-bar"
const PROG_IND = "prog-ind"
const progressBar = (width, height, barId, indId) => {
    return `
        <div id="${barId}" style="width: ${width}px; height: ${height}px; background: #ffe6d5; z-index: 99999;">
        </div>
        <div id="${indId}" style="width: 4px; height: ${height}px; background: tomato; z-index: 100000;">
        </div>
    `
}

const render = (barId, indId, infoId) => {
   return `
        ${progressBar(progBarDims.width, progBarDims.height, PROG_BAR, PROG_IND, barId, indId)}
        <div id="${infoId}" class="${styles.txt} ${styles.info}">loading</div>
        <div id="${infoId}" class="${styles.txt} ${styles.info}"></div>
    `
}

const initUI = (uiRoot) => {
    uiRoot.content = render(PROG_BAR, PROG_IND, INFO)
    const progBar = uiRoot.get(`#${PROG_BAR}`)
    const progInd = uiRoot.get(`#${PROG_IND}`)
    const info = uiRoot .get(`#${INFO}`)
    const realign = viewport => { 
        progBar.pos = calcAligned(viewport, progBarDims, "center", "center")
        progInd.pos = calcAligned(viewport, progBarDims, "center", "center",)
        info.pos = calcStacked(progBar, UI.bounds(info), "bottom", 0, 20)
    }
    config.viewport.on("change", realign)
    realign(config.viewport)
    return {
        teardown: () => {
            config.viewport.off("change", realign)
            uiRoot.clear()
        },
        onProg: (p, msg) => {
            progInd.domNode.style.width = `${Math.round(p * progBarDims.width)}px`
            info.content = `${Math.round(p * 100)}%`
            realign(config.viewport)
        },
        onError: e => {
            info.content = !!e && e.message === "offline" ? "Error: No Internet": "Error: Unsupported Device"
            info.domNode.style.color = "tomato"
            realign(config.viewport)
        }
    }
}

export default initUI