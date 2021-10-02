import { calcAligned } from "@lib/utils/entity"
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

const lock = `
<div id="${LOCK}" class=${styles.lock}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="#ffe6d5" width="24" height="24" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z"/></svg>
</div>
`
const levelInfo = level => {
    return `
        <div class="${styles.infoTitle}" id="${INFO}">${"Level " + level}</div>
    `
}
const render = (images, level, levels) => {
    return `
        ${imgBtn(PREV, images.arrow, styles.prevBtn)}
        ${lock}
        ${levelInfo(level, levels)}
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

export default ({ onStart, uiRoot, curLevel, images, assetsCache }) => {
    uiRoot.content = render(images, curLevel, levels)
    let levelState = curLevel

    const prevBtn = uiRoot.get(`#${PREV}`)
    const nextBtn = uiRoot.get(`#${NEXT}`)
    const startBtn = uiRoot.get(`#${START}`)
    const levelInfo = uiRoot.get(`#${INFO}`)
    const lockInd = uiRoot.get(`#${LOCK}`)

    const realign = viewport => {
        prevBtn.pos = calcAligned(viewport, prevBtn.bounds, "left", "center", 50)
        levelInfo.pos = calcAligned(viewport, levelInfo.bounds, "center", "center", 0, 0)
        lockInd.pos = calcAligned(viewport, { width: 24, height: 24 }, "center", "center", 0, 40)
        nextBtn.pos = calcAligned(viewport, nextBtn.bounds, "right", "center", -50)
        startBtn.pos = calcAligned(viewport, startBtn.bounds, "center", "bottom", 0,  -100)
    }
    const updateBtnVis = (level, curLevel) => {
        lockInd.domNode.style.opacity = level <= curLevel ? 0: 1
        startBtn.domNode.style.opacity = level <= curLevel ? 1: 0
    }
    const onPrevBtnClick = () => {
        levelState = Math.max(levelState - 1, 1)
        levelInfo.content = `Level ${levelState}`
        updateBtnVis(levelState, curLevel)
    }
    const onNextBtnClick = () => {
        levelState = Math.min(levelState  + 1, levels.length)
        levelInfo.content = `Level ${levelState}`
        updateBtnVis(levelState, curLevel)
    }
    const onStartBtnClick = () =>{
        if (levelState > curLevel) { return }
        const levelId = levels[levelState - 1].id
        config.viewport.off("change", realign)
        uiRoot.clear()
        if (!assetsCache.get(levelId)) {
            uiRoot.content = renderLoading()
            const loadingInd = uiRoot.get(`#${LOADING}`)
            loadingInd.pos = calcAligned(config.viewport, { width: 56, height: 12 }, "center", "center")
            levels.forEach(level => {
                assetsCache.unload(level.id)
            })
            assetsCache.load([{ url: levelId }])
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