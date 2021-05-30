import config from "@config"
import { center } from "@utils/entity"
import styles from "./style.css"
const BTN_ID = "play-btn"
const render = () => 
`
    <div class="${styles.playBtn}" id="${BTN_ID}">
        PLAY
    </div>
`

const initUI = ({ uiRoot, onPlay }) => {
    uiRoot.content = render()
    
    const playBtn = uiRoot.get(`#${BTN_ID}`)
    const playBtnBounds = playBtn.bounds
    const realign = viewport => { 
        playBtn.pos = center(viewport, playBtnBounds)
    }
    playBtn.on("click", onPlay)
    config.viewport.on("change", realign)
    realign(config.viewport)
    return () => {
        uiRoot.clear()
        playBtn.off("click", onPlay)
        config.viewport.off("change", realign)
    }
}

export default initUI