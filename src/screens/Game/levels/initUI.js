import { calcAligned, calcStacked } from "@utils/entity"
import config from "@config"
import imgBtn from "@screens/ui/imgBtn"
import styles from "./style.css"
import * as states from "./states.js"

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

export default (uiRoot, player, images, storage) => {
    uiRoot.content = render(images, storage.getOrbCount())
    const ctrlBtns = config.isMobile && player.getCtrlBtns()
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
    const state = {
        _name: "",
        elapsed: 0,
        get() {
            return this._name
        },
        set(name) {
            this._name = name
            switch (name) {
                case states.PLAYING:
                    resumeBtn.opacity = 0
                    restartBtn.opacity = 0
                    crossBtn.opacity = 0

                    orbExpInd.opacity = 0
                    orbExp.opacity = 0

                    pauseBtn.opacity = 1
                    orbInd.opacity = 1
                    orbCount.opacity = 1
                    timer.opacity = 1
                break
                case states.PAUSED:
                    resumeBtn.opacity = 1
                    restartBtn.opacity = 1
                    crossBtn.opacity = 1

                    orbExpInd.opacity = 0
                    orbExp.opacity = 0

                    pauseBtn.opacity = 0
                    orbInd.opacity = 0
                    orbCount.opacity = 0
                    timer.opacity = 0
                break
                case states.GAME_OVER:
                    resumeBtn.opacity = 1
                    restartBtn.opacity = 1
                    crossBtn.opacity = 1

                    orbExpInd.opacity = 1
                    orbExp.opacity = 1

                    pauseBtn.opacity = 0
                    orbInd.opacity = 0
                    orbCount.opacity = 0
                    timer.opacity = 0
                break
            }
        }
    }
    state.set(states.PLAYING)
    realign(config.viewport)
    config.viewport.on("change", realign)
    storage.on("orb-update", changeOrbCount)
    return {
        teardownUI: () => {
            config.viewport.off("change", realign)
            storage.off("orb-update", changeOrbCount)
            uiRoot.clear()
        },
        updateTimer: dt => {
            if (state.get() !== states.PLAYING) {
                return
            }
            const t = state.elapsed + dt
            const secs = Math.floor(t)
            const ds = Math.floor((t - secs) * 10) // deciseconds
            const pad = t < 10 ? "000":
                        t < 100 ? "00":
                        t < 1000 ? "0": ""
            timer.content = `${pad}${secs}:${ds}`
            state.elapsed = t
        },
        switchState: state.set.bind(state)
    }
}