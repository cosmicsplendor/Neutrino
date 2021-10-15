import config from "@config"
import UI from "@lib/utils/UI"
import { calcAligned, calcStacked } from "@utils/entity"
import loadingDot from "@screens/ui/loadingDot"
import styles from "./style.css"

const LOADING = "loading"
const PROG = "progress"
const INFO = "info"

const render = (loadingId, progId, infoId) => {
   return `
        ${loadingDot(loadingId)}
        <div id="${progId}" class="${styles.txt}">0%</div>
        <div id="${infoId}" class="${styles.txt} ${styles.info}">loading assets</div>
    `
}

const initUI = (uiRoot) => {
    uiRoot.content = render(LOADING, PROG, INFO)
    const loadingInd = uiRoot.get(`#${LOADING}`)
    const progInd = uiRoot.get(`#${PROG}`)
    const info = uiRoot .get(`#${INFO}`)
    const realign = viewport => { 
        loadingInd.pos = calcAligned(viewport, loadingInd, "center", "center")
        progInd.pos = calcStacked(loadingInd, UI.bounds(progInd), "bottom", 0, 20)
        info.pos = calcStacked(progInd, UI.bounds(info), "bottom", 0, 20)
    }
    config.viewport.on("change", realign)
    realign(config.viewport)
    return {
        teardown: () => {
            config.viewport.off("change", realign)
            uiRoot.clear()
        },
        onProg: (p, msg) => {
            progInd.content = `${Math.floor(p * 100)}%`
            if (!!msg) {
                info.content = msg
            }
            realign(config.viewport)
        }
    }
}

export default initUI