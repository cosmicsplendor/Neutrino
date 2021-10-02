import UI from "@utils/UI"
import config from "@config"
import { calcCentered } from "@utils/entity"
import styles from "./style.css"
const BTN_ID = "play-btn"
const render = (btnImg) => 
`
<div 
    class="${styles.playBtn}" 
    id="${BTN_ID}" 
    style="width: ${btnImg.width}px; height: ${btnImg.height}px; background: url(${btnImg.src});"
>
</div>
`

const doc = new UI(document)

const initUI = ({ uiRoot, btnImg, onPlay }) => {
    console.log(btnImg)
    uiRoot.content = render(btnImg)
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