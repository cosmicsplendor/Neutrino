import { calcAligned, calcStacked, calcComposite, combine } from "@utils/entity"
import config from "@config"
import imgBtn from "@screens/ui/imgBtn"
import soundBtn from "./soundBtn"
import styles from "./style.css"

const margin = 20
const hMargin = margin / 2 // hMargin
const orbExpAmt = 2
const instFocThres = 1400

const PAUSE = "pause-btn"
const RESUME  = "resume-btn"
const ORB_AV = "orb-av" // orb available
const TIMER = "timer"
const ORB_IND = "orb-ind"
const ORB_EXP = "orb-exp" // orb expend
const ORB_EXP_IND = "orb-exp-ind"
const CROSS = "cross-btn"
const RESET = "reset-btn"

const OVERLAY = "overlay"
const CUR_TIME_IND = "cur-time-ind"
const CUR_TIME = "cur-time"
const BEST_TIME_IND = "best-time-ind"
const BEST_TIME = "best-time"
const CONTINUE = "continue"

const render = (images, orbAv) => {
    return `
        ${imgBtn(ORB_IND, images.orb, styles.hidden, "orb count")}
        <div id="${TIMER}" class="${styles.timer} ${styles.hidden}"> 0000:0 </div>
        <div id="${ORB_AV}" class="${styles.orbTxt} ${styles.hidden}"> ${orbAv} </div>
        ${imgBtn(PAUSE, images.pause, styles.hidden, "pause game")}
        ${imgBtn(RESUME, images.resume, styles.hidden, "resume")}
        ${imgBtn(ORB_EXP_IND, images.orb, styles.hidden)}
        <div id="${ORB_EXP}" class="${styles.orbTxt} ${styles.hidden}"> &times; ${orbExpAmt} </div>
        ${imgBtn(RESET, images.reset, styles.hidden, "restart")}
        ${imgBtn(CROSS, images.cross, styles.hidden, "exit to level screen")}
    `
}

const renderResult = (resumeImg, curTime, bestTime) => {
    return `
        <div class="${styles.overlay} ${styles.hidden}" id="${OVERLAY}">  </div>
        <div class="${styles.time} ${styles.hidden}" id="${CUR_TIME_IND}">finished in:</div>
        <div class="${styles.timeVal} ${styles.hidden}" id="${CUR_TIME}"> ${curTime.toFixed(2)}s </div>
        <div class="${styles.time} ${styles.hidden}" id="${BEST_TIME_IND}"> record time: </div>
        <div class="${styles.timeVal} ${styles.recTimeVal} ${styles.hidden}" id="${BEST_TIME}"> ${bestTime === 0 || curTime < bestTime ? "new!": bestTime.toFixed(2) + "s"} </div>
        ${imgBtn(CONTINUE, resumeImg, `${styles.hidden} ${styles.continue}`)}
    `
}

export default (uiRoot, player, images, storage, gameState, onClose, resetLevel, focusInst, getCheckpoint, btnSound, errSound, contSound, webAudioSupported) => {
    uiRoot.content = render(images, storage.getOrbCount(), webAudioSupported)
    let checkpoint
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
    const music = soundBtn(storage, "getMusic", "setMusic", gameState, images.musOn, images.musOff, contSound, webAudioSupported, "toggle music")
    const sfx = soundBtn(storage, "getSfx", "setSfx", gameState, images.sfxOn, images.sfxOff, contSound, webAudioSupported, "toggle audio")

    uiRoot.add(music)
          .add(sfx)
    if (ctrlBtns) {
        uiRoot.add(ctrlBtns.left)
              .add(ctrlBtns.right)
              .add(ctrlBtns.axn)
    }
    const changeOrbCount = num => {
        orbCount.content = num
    }
    const showCtrlBtns = () => {
        if (!config.isMobile) return
        ctrlBtns.left.show()
        ctrlBtns.right.show()
        ctrlBtns.axn.show()
    }
    const hideCtrlBtns = () => {
        if (!config.isMobile) return
        ctrlBtns.left.hide()
        ctrlBtns.right.hide()
        ctrlBtns.axn.hide()
    }
    const alginCtrlBtns = (viewport) => {
        if (!config.isMobile) { return }
        ctrlBtns.left.pos = calcAligned(viewport, ctrlBtns.left, "left", "bottom", margin, -margin * 1.5)
        ctrlBtns.right.pos = calcStacked(ctrlBtns.left, ctrlBtns.right, "right", margin)
        ctrlBtns.axn.pos = calcAligned(viewport, ctrlBtns.right, "right", "bottom", - margin, - margin * 1.75)
    }
    const realign = viewport => {
        music.pos = calcAligned(viewport, music, "left", "top", margin, margin)
        orbInd.pos = calcStacked(music, orbInd, "right", margin)
        orbCount.pos = calcStacked(orbInd, orbCount, "right", hMargin)
        pauseBtn.pos = calcAligned(viewport, pauseBtn, "right", "top", -margin, margin)
        sfx.pos = calcStacked(pauseBtn, sfx, "left", -margin)
        timer.pos = calcStacked(pauseBtn, timer, "bottom", 0, hMargin)
        restartBtn.pos = calcAligned(viewport, restartBtn, "center", "center")
        resumeBtn.pos = calcStacked(restartBtn, resumeBtn, "top", 0, -hMargin)
        orbExpInd.pos = calcStacked(resumeBtn, orbExpInd, "right", margin)
        orbExp.pos = calcStacked(orbExpInd, orbExp, "right", hMargin)
        crossBtn.pos = calcStacked(restartBtn, crossBtn, "bottom", 0, hMargin)
        alginCtrlBtns(viewport)
    }
    const onPlay = () => {
        resumeBtn.hide()
        restartBtn.hide()
        crossBtn.hide()

        orbExpInd.hide()
        orbExp.hide()

        music.show()
        sfx.show()
        pauseBtn.show()
        orbInd.show()
        orbCount.show()
        timer.show()

        showCtrlBtns()
    }
    const onPause = () => {
        resumeBtn.show()
        restartBtn.show()
        crossBtn.show()

        orbExpInd.hide()
        orbExp.hide()

        music.hide()
        sfx.hide()
        pauseBtn.hide()
        orbInd.hide()
        orbCount.hide()
        timer.hide()

        hideCtrlBtns()
    }
    const onOver = x => {
        checkpoint = getCheckpoint(x)
        resumeBtn.show()
        restartBtn.show()
        crossBtn.show()
        
        orbInd.show()
        orbCount.show()
        
        music.hide()
        sfx.hide()
        pauseBtn.hide()
        timer.hide()

        if (!!checkpoint) {
            orbExpInd.show()
            orbExp.show()
            return
        }
        // if checkpoint doesn't exist there is no point in showing orb expend indicator
        orbExpInd.hide()
        orbExp.hide()

        hideCtrlBtns()
    }
    const onComplete = (curTime, bestTime) => {
        uiRoot.clear()
        uiRoot.content = renderResult(images.resume, curTime, bestTime)
        const overlay = uiRoot.get(`#${OVERLAY}`)
        const curTimeInd = uiRoot.get(`#${CUR_TIME_IND}`)
        const curTimeVal = uiRoot.get(`#${CUR_TIME}`)
        const bestTimeInd = uiRoot.get(`#${BEST_TIME_IND}`)
        const bestTimeVal = uiRoot.get(`#${BEST_TIME}`)
        const continueBtn = uiRoot.get(`#${CONTINUE}`)

        overlay.domNode.style.width = `${config.viewport.width}px`
        overlay.domNode.style.height = `${config.viewport.height}px`

        bestTimeInd.pos = calcAligned(config.viewport, combine(bestTimeInd, bestTimeVal, "x"), "center", "center")
        bestTimeVal.pos = calcStacked(bestTimeInd, bestTimeVal, "right", 8)
        curTimeInd.pos = calcStacked(bestTimeInd, bestTimeInd, "top-start", 0, -8)
        curTimeVal.pos = calcStacked(curTimeInd, curTimeVal, "right", 8)
        continueBtn.pos = calcStacked(calcComposite([ bestTimeInd, bestTimeVal ]), continueBtn, "bottom", 0, 16)
        
        
        continueBtn.on("click", () => {
            contSound.play()
            onClose(true)
        })
        
        overlay.domNode.style.opacity = 0.8
        curTimeInd.show()
        curTimeVal.show()
        bestTimeInd.show()
        bestTimeVal.show()
        continueBtn.show()
    }

    gameState.on("play", onPlay)
    gameState.on("pause", onPause)
    gameState.on("over", onOver)
    gameState.on("complete", onComplete)
    config.viewport.on("change", realign)
    storage.on("orb-update", changeOrbCount)
    pauseBtn.on("click", () => {
        if (!gameState.is("playing")) return
        gameState.pause()
        btnSound.play()
    })
    resumeBtn.on("click", () => {
        if (gameState.is("playing") || gameState.is("completed")) return
        if (gameState.is("paused")) {
            gameState.play()
            return btnSound.play()
        } 
        if (!gameState.is("over")) return

        // have players pay 2 orbs
        const orbs = storage.getOrbCount()
        if (orbs < orbExpAmt && !!checkpoint) { // may be signal to player that there's not enough orbs to continue, provide that there's also a checkpoint available for player restore
            return errSound.play()
        }
        
        btnSound.play()
        gameState.play()
        resetLevel()
        gameState.play()
        if (!!checkpoint) {
            storage.setOrbCount(orbs - orbExpAmt)
            player.pos.x = checkpoint.x
            player.pos.y = checkpoint.y
        }
    })
    crossBtn.on("click", () => {
        if (gameState.is("playing") || gameState.is("completed")) return
        onClose(false)
        btnSound.play()
    })
    restartBtn.on("click", () => {
        if (gameState.is("playing") || gameState.is("completed")) return
        const posXAtReset = player.pos.x
        resetLevel()
        posXAtReset > instFocThres && focusInst() // if the player is not near enough to it's reset spawn point, focus the camera to player position instantly to avoid jarring focus
        gameState.elapsed = 0
        gameState.play()
        btnSound.play()
    })
    music.on("click", () => {
        if (!gameState.is("playing")) return
        const musicOn = storage.getMusic()
        storage.setMusic(!musicOn)
        music.domNode.style.background = `url(${musicOn ? images.musOff.src: images.musOn.src})`
    })
    realign(config.viewport)
    return {
        teardownUI: () => {
            config.viewport.off("change", realign)
            storage.off("orb-update", changeOrbCount)
            gameState.off("play", onPlay)
            gameState.off("pause", onPause)
            gameState.off("over", onOver)
            gameState.off("complete", onComplete)
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