import { calcAligned, calcStacked } from "@utils/entity"
import config from "@config"
import imgBtn from "@screens/ui/imgBtn"
import styles from "./style.css"

const margin = 20
const hMargin = margin / 2 // hMargin
const orbExpAmt = 2

const PAUSE = "pause-btn"
const RESUME  = "resume-btn"
const ORB_AV = "orb-av" // orb available
const TIMER = "timer"
const ORB_IND = "orb-ind"
const ORB_EXP = "orb-exp" // orb expend
const ORB_EXP_IND = "orb-exp-ind"
const CROSS = "cross-btn"
const RESET = "reset-btn"

const render = (images, orbAv) => {
    return `
        ${imgBtn(ORB_IND, images.orb)}
        <div id="${TIMER}" class="${styles.timer}"> 0000:0 </div>
        <div id="${ORB_AV}" class="${styles.orbTxt}"> ${orbAv} </div>
        ${imgBtn(PAUSE, images.pause)}
        ${imgBtn(RESUME, images.resume)}
        ${imgBtn(ORB_EXP_IND, images.orb)}
        <div id="${ORB_EXP}" class="${styles.orbTxt}"> &times; ${orbExpAmt} </div>
        ${imgBtn(RESET, images.reset)}
        ${imgBtn(CROSS, images.cross)}
    `
}

export default (uiRoot, ctrlBtns, images, storage, gameState, onClose, onRestart) => {
    uiRoot.content = render(images, storage.getOrbCount())
    const orbInd = uiRoot.get(`#${ORB_IND}`)
    const orbCount = uiRoot.get(`#${ORB_AV}`)
    const orbExp = uiRoot.get(`#${ORB_EXP}`)
    const orbExpInd = uiRoot.get(`#${ORB_EXP_IND}`)
    const pauseBtn = uiRoot.get(`#${PAUSE}`)
    const resumeBtn = uiRoot.get(`#${RESUME}`)
    const restartBtn = uiRoot.get(`#${RESET}`)
    const crossBtn = uiRoot.get(`#${CROSS}`)
    const timer = uiRoot.get(`#${TIMER}`)
    if (ctrlBtns) {
        uiRoot.add(ctrlBtns.left)
              .add(ctrlBtns.right)
              .add(ctrlBtns.axn)
    }
    const changeOrbCount = num => {
        orbCount.content = num
    }
    const realign = viewport => {
        orbInd.pos = calcAligned(viewport, orbInd, "left", "top", margin, margin)
        orbCount.pos = calcStacked(orbInd, orbCount, "right", hMargin)
        pauseBtn.pos = calcAligned(viewport, pauseBtn, "right", "top", -margin, margin)
        timer.pos = calcStacked(pauseBtn, timer, "bottom", 0, hMargin)
        restartBtn.pos = calcAligned(viewport, restartBtn, "center", "center")
        resumeBtn.pos = calcStacked(restartBtn, resumeBtn, "top", 0, -hMargin)
        orbExpInd.pos = calcStacked(resumeBtn, orbExpInd, "right", margin)
        orbExp.pos = calcStacked(orbExpInd, orbExp, "right", hMargin)
        crossBtn.pos = calcStacked(restartBtn, crossBtn, "bottom", 0, hMargin)
        if (!ctrlBtns) { return }
        ctrlBtns.left.pos = calcAligned(viewport, ctrlBtns.left, "left", "bottom", margin, -margin)
        ctrlBtns.right.pos = calcAligned(viewport, ctrlBtns.right, "left", "bottom", 40 + (ctrlBtns.left.width), -margin)
        ctrlBtns.axn.pos = calcAligned(viewport, ctrlBtns.right, "right", "bottom", -margin, -margin)
    }
    const onPlay = () => {
        resumeBtn.hide()
        restartBtn.hide()
        crossBtn.hide()

        orbExpInd.hide()
        orbExp.hide()

        pauseBtn.show()
        orbInd.show()
        orbCount.show()
        timer.show()
    }
    const onPause = () => {
        resumeBtn.show()
        restartBtn.show()
        crossBtn.show()

        orbExpInd.hide()
        orbExp.hide()

        pauseBtn.hide()
        orbInd.hide()
        orbCount.hide()
        timer.hide()
    }
    const onOver = () => {
        resumeBtn.show()
        restartBtn.show()
        crossBtn.show()

        orbExpInd.show()
        orbExp.show()

        pauseBtn.hide()
        orbInd.hide()
        orbCount.hide()
        timer.hide()
    }

    gameState.on("play", onPlay)
    gameState.on("pause", onPause)
    gameState.on("over", onOver)
    config.viewport.on("change", realign)
    storage.on("orb-update", changeOrbCount)
    pauseBtn.on("click", () => {
        if (gameState.is("paused")) return
        gameState.pause()
    })
    resumeBtn.on("click", () => {
        if (gameState.is("playing")) return
        if (gameState.is("paused")) {
            return gameState.play()
        } 
        if (gameState.is("over")) {
            
        }
    })
    crossBtn.on("click", () => {
        onClose()
    })
    restartBtn.on("click", () => {
        onRestart()
        gameState.play()
    })
    realign(config.viewport)
    return {
        teardownUI: () => {
            config.viewport.off("change", realign)
            storage.off("orb-update", changeOrbCount)
            gameState.off("play", onPlay)
            gameState.off("pause", onPause)
            gameState.off("over", onOver)
            uiRoot.clear()
        },
        updateTimer: t => {
            if (!gameState.is("playing")) {
                return
            }
            const secs = Math.floor(t)
            const ds = Math.floor((t - secs) * 10) // deciseconds
            const pad = t < 10 ? "000":
                        t < 100 ? "00":
                        t < 1000 ? "0": ""
            timer.content = `${pad}${secs}:${ds}`
        }
    }
}