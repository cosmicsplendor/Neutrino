import { calcAligned, calcStacked } from "@lib/utils/entity"
import config from "@config"
import levels from "@config/levels"
import imgBtn from "@screens/ui/imgBtn"
import styles from "./style.css"

const PREV = "prev-btn"
const NEXT = "next-btn"
const START = "start-btn"
const INFO = "lev-info"
const LOCK = "lock"
const LOADING = "loading"
const BEST_TIME = "best-time"

const lockDims = Object.freeze({ width: 24, height: 24 })
const lock = `
<div id="${LOCK}" class=${styles.lock}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="#ffe6d5" width="${lockDims.width}" height="${lockDims.height}" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z"/></svg>
</div>
`
const renderBest = val => {
    return `Best Time: ${!!val ? val.toFixed(2) + "s": "N/A"}`
}
const render = (images, level, time) => {
    return `
        ${imgBtn(PREV, images.arrow, styles.prevBtn)}
        ${lock}
        <div class="${styles.infoTitle}" id="${INFO}">${"Level " + level}</div> 
        <div class="${styles.infoTitle} ${styles.infoSub}" id="${BEST_TIME}">${renderBest(time)}</div>
        ${imgBtn(NEXT, images.arrow)}
        ${imgBtn(START, images.resume, styles.startBtn)}
    `
}
const renderLoading = () => {
    return `
        <div id="${LOADING}">
            <div class="${styles.loadingDot} ${styles.dotA}"></div>
            <div class="${styles.loadingDot} ${styles.dotB}"></div>
            <div class="${styles.loadingDot} ${styles.dotC}"></div>
        </div>
    `
}

export default ({ onStart, uiRoot, storage, images, assetsCache, contSound, chSound, errSound }) => {
    const curLevel = storage.getCurLevel()
    let levelState = curLevel
    uiRoot.content = render(images, curLevel, storage.getHiscore(levelState))

    const prevBtn = uiRoot.get(`#${PREV}`)
    const nextBtn = uiRoot.get(`#${NEXT}`)
    const startBtn = uiRoot.get(`#${START}`)
    const levelInfo = uiRoot.get(`#${INFO}`)
    const lockInd = uiRoot.get(`#${LOCK}`)
    const bestTime = uiRoot.get(`#${BEST_TIME}`)

    const realignTxt = viewport => {
        const { width: tWidth, height: tHeight } = levelInfo.domNode.getBoundingClientRect()
        const { width: sWidth, height: sHeight } = bestTime.domNode.getBoundingClientRect()

        levelInfo.width = tWidth
        levelInfo.height = tHeight
        bestTime.width = sWidth
        bestTime.height = sHeight
        
        levelInfo.pos = calcAligned(viewport, levelInfo, "center", "center", 0, -10)
        bestTime.pos = calcStacked(levelInfo, bestTime, "bottom", 0, 8)
        lockInd.pos = calcStacked(bestTime, lockDims, "bottom", 0, 20)
    }
    const realign = viewport => {
        realignTxt(viewport)
        prevBtn.pos = calcAligned(viewport, prevBtn, "left", "center", 50)
        nextBtn.pos = calcAligned(viewport, nextBtn, "right", "center", -50)
        startBtn.pos = calcStacked(bestTime, startBtn, "bottom", 0,  64)
    }
    const updateBtnVis = (level, curLevel) => {
        lockInd.domNode.style.opacity = level <= curLevel || level > levels.length ? 0: 1
        startBtn.domNode.style.opacity = level <= curLevel ? 1: 0   
    }
    const onPrevBtnClick = () => {
        if (levelState === 1) return errSound.play()
        levelState = Math.max(levelState - 1, 1)
        const best = storage.getHiscore(levelState)
        bestTime.content = renderBest(best)
        levelInfo.content = `Level ${levelState}`
        updateBtnVis(levelState, curLevel)
        realignTxt(config.viewport)
        chSound.play()
    }
    const onNextBtnClick = () => {
        if (levelState > levels.length) return errSound.play()
        levelState = Math.min(levelState  + 1, levels.length + 1)
        const best = storage.getHiscore(levelState)
        levelInfo.content = levelState <= levels.length ? `Level ${levelState}`: "Coming Soon"
        bestTime.content = levelState <= levels.length ? renderBest(best): "please like for more"
        updateBtnVis(levelState, curLevel)
        realignTxt(config.viewport)
        chSound.play()
    }
    const onStartBtnClick = () =>{
        if (levelState > curLevel) { return }
        const levelId = levels[levelState - 1].id
        config.viewport.off("change", realign)
        uiRoot.clear()
        contSound.play()
        if (!assetsCache.get(levelId)) {
            uiRoot.content = renderLoading()
            const loadingInd = uiRoot.get(`#${LOADING}`)
            loadingInd.pos = calcAligned(config.viewport, { width: 56, height: 12 }, "center", "center")
            levels.forEach(level => {
                assetsCache.unload(level.id)
            })
            assetsCache.load([ levelId ])
            assetsCache.once("load", () => {
                onStart(levelState)
            })
            return
        }
        onStart(levelState)
    }
    
    prevBtn.on("click", onPrevBtnClick)
    nextBtn.on("click", onNextBtnClick)
    startBtn.on("click", onStartBtnClick)
    config.viewport.on("change", realign)
    realign(config.viewport)
    return () => {
        prevBtn.off("click", onPrevBtnClick)
        nextBtn.off("click", onNextBtnClick)
        startBtn.off("click", onStartBtnClick)
    }
}