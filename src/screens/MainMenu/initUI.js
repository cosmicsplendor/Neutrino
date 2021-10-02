import UI from "@utils/UI"
import config from "@config"
import { calcCentered } from "@utils/entity"
import styles from "./style.css"
const BTN_ID = "play-btn"
const render = () => 
`
<div class="${styles.playBtn}" id="${BTN_ID}">
    PLAY
</div>
`

const doc = new UI(document)

const initUI = ({ uiRoot, onPlay }) => {
    uiRoot.content = render()
    const playBtn = uiRoot.get(`#${BTN_ID}`)
    const playBtnBounds = playBtn.bounds
    const realign = viewport => { 
        playBtn.pos = calcCentered(viewport, playBtnBounds)
    }
    playBtn.on("click", onPlay)
    doc.on("keypress", onPlay)
    config.viewport.on("change", realign)
    realign(config.viewport)
    return () => {
        playBtn.off("click", onPlay)
        uiRoot.clear()
        doc.off("keypress", onPlay)
        config.viewport.off("change", realign)
    }
}

export default initUI