import { calcAligned } from "@utils/entity"
import config from "@config"
import imgBtn from "@screens/ui/imgBtn"
const margin = 20

const PAUSE = "pause-btn"
const RESUME  = "resume-btn"
const ORB_IND = "orb-ind"
const CROSS = "cross-btn"
const RESET = "reset-btn"

const render = (images) => {
    return `
        ${imgBtn(ORB_IND, images.orb)}
        ${imgBtn(PAUSE, images.pause)}
        ${imgBtn(RESUME, images.resume)}
        ${imgBtn(RESET, images.reset)}
        ${imgBtn(CROSS, images.cross)}
    `
}

export default (uiRoot, player, images) => {
    uiRoot.content = render(images)
    const ctrlBtns = config.isMobile && player.getCtrlBtns()
    const orbInd = uiRoot.get(`#${ORB_IND}`)
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
        const restartBB = restartBtn.bounds
        orbInd.pos = calcAligned(viewport, orbInd.bounds, "left", "top", margin, margin)
        pauseBtn.pos = calcAligned(viewport, pauseBtn.bounds, "right", "top", -margin, margin)
        resumeBtn.pos = calcAligned(viewport, resumeBtn.bounds, "center", "center", 0, -restartBB.height - (margin / 2))
        restartBtn.pos = calcAligned(viewport, restartBB, "center", "center")
        crossBtn.pos = calcAligned(viewport, crossBtn.bounds, "center", "center", 0, restartBB.height + (margin / 2))
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