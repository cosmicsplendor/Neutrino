import { calcAligned, calcStacked } from "@utils/entity"
import config from "@config"
import imgBtn from "@screens/ui/imgBtn"
import styles from "./style.css"

const margin = 20
const orbExpAmt = 2

const PAUSE = "pause-btn"
const RESUME  = "resume-btn"
const ORB_IND = "orb-ind"
const ORB_EXP = "orb-exp" // orb expend
const ORB_EXP_IND = "orb-exp-ind"
const CROSS = "cross-btn"
const RESET = "reset-btn"

const render = (images) => {
    return `
        ${imgBtn(ORB_IND, images.orb)}
        ${imgBtn(PAUSE, images.pause)}
        ${imgBtn(RESUME, images.resume)}
        ${imgBtn(ORB_EXP_IND, images.orb)}
        <div id="${ORB_EXP}" class="${styles.orbExp}"> &times; ${orbExpAmt} </div>
        ${imgBtn(RESET, images.reset)}
        ${imgBtn(CROSS, images.cross)}
    `
}

export default (uiRoot, player, images) => {
    uiRoot.content = render(images)
    const ctrlBtns = config.isMobile && player.getCtrlBtns()
    const orbInd = uiRoot.get(`#${ORB_IND}`)
    const orbExp = uiRoot.get(`#${ORB_EXP}`)
    const orbExpInd = uiRoot.get(`#${ORB_EXP_IND}`)
    const pauseBtn = uiRoot.get(`#${PAUSE}`)
    const resumeBtn = uiRoot.get(`#${RESUME}`)
    const restartBtn = uiRoot.get(`#${RESET}`)
    const crossBtn = uiRoot.get(`#${CROSS}`)
    if (ctrlBtns) {
        uiRoot.add(ctrlBtns.left)
              .add(ctrlBtns.right)
              .add(ctrlBtns.axn)
    }
    const realign = viewport => {
        const orbExpBounds = orbExp.bounds
        orbInd.pos = calcAligned(viewport, images.orb, "left", "top", margin, margin)
        pauseBtn.pos = calcAligned(viewport, images.pause, "right", "top", -margin, margin)
        restartBtn.pos = calcAligned(viewport, images.reset, "center", "center")
        resumeBtn.pos = calcStacked(restartBtn.bounds, images.resume, "top")
        orbExpInd.pos = calcAligned(viewport, images.orb, "center", "center", (images.reset.width / 2) + margin + images.orb.width / 2, -images.reset.height - (margin / 2))
        orbExp.pos = calcAligned(viewport, orbExpBounds, "center", "center", (images.reset.width / 2) + margin * 3 / 2 +  images.orb.width + orbExpBounds.width / 2, -images.reset.height - (margin / 2))
        crossBtn.pos = calcAligned(viewport, images.cross, "center", "center", 0, images.reset.height + (margin / 2))
        if (!ctrlBtns) { return }
        ctrlBtns.left.pos = calcAligned(viewport, ctrlBtns.left.bounds, "left", "bottom", margin, -margin)
        ctrlBtns.right.pos = calcAligned(viewport, ctrlBtns.right.bounds, "left", "bottom", 40 + (ctrlBtns.left.bounds.width), -margin)
        ctrlBtns.axn.pos = calcAligned(viewport, ctrlBtns.right.bounds, "right", "bottom", -margin, -margin)
    }
    realign(config.viewport)
    config.viewport.on("change", realign)
    return () => {
        config.viewport.off("change", realign)
        uiRoot.clear()
    }
}