import UI from "@utils/UI"
import config from "@config"
import { calcAligned } from "@utils/entity"
import btn from "@screens/ui/btn"

const BTN_ID = "play-btn"
const doc = new UI(document)

const initUI = ({ uiRoot, onPlay, logo, ball }) => {
    uiRoot.content = btn(BTN_ID, "PLAY")
    const playBtn = uiRoot.get(`#${BTN_ID}`)
    const realign = viewport => { 
        playBtn.pos = calcAligned(viewport, playBtn, "center", "center", 0, 0)
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