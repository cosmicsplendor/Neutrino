import { calcAligned, calcStacked } from "@lib/utils/entity"
import config from "@config"
import levels from "@config/levels"
import imgBtn from "@screens/ui/imgBtn"
import loadingDot from "@screens/ui/loadingDot"
import styles from "./style.css"
import btn from "@screens/ui/btn"

const PREV = "prev-btn"
const NEXT = "next-btn"
const START = "start-btn"
const INFO = "lev-info"
const LOCK = "lock"
const LOADING = "loading"
const BEST_TIME = "best-time"
const TWITTER = "twitter"
const ERROR = "err"

const paddingX = config.isMobile ? 20: 60
const lockDims = Object.freeze({ width: 24, height: 24 })
const twitDims = Object.freeze({ width: 48, height: 48 })
const lock = `
<div id="${LOCK}" class="${styles.icon}">
    <svg xmlns="http://www.w3.org/2000/svg" fill="#ffe6d5" width="${lockDims.width}" height="${lockDims.height}" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z"/></svg>
</div>
`
const twitter = `
<div id="${TWITTER}" class="${styles.icon}" style="display:none;">
    <a  href="${config.twitLink}" target="_blank">
        <svg style="border-radius: 6px;" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 ${twitDims.width} ${twitDims.height}" xml:space="preserve" width="${twitDims.width}" height="${twitDims.height}"><metadata id="metadata16"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /><dc:title></dc:title></cc:Work></rdf:RDF></metadata><defs id="defs14" /><style type="text/css" id="style2">.st0{fill:#1D9BF0;}.st1{fill:#FFFFFF;}</style><g id="g846" transform="scale(0.12)"><g id="Dark_Blue"><rect class="st0" width="400" height="400" id="rect4" x="0" y="0" /></g><g id="Logo__x2014__FIXED"><path class="st1" d="m 153.6,301.6 c 94.3,0 145.9,-78.2 145.9,-145.9 0,-2.2 0,-4.4 -0.1,-6.6 10,-7.2 18.7,-16.3 25.6,-26.6 -9.2,4.1 -19.1,6.8 -29.5,8.1 10.6,-6.3 18.7,-16.4 22.6,-28.4 -9.9,5.9 -20.9,10.1 -32.6,12.4 -9.4,-10 -22.7,-16.2 -37.4,-16.2 -28.3,0 -51.3,23 -51.3,51.3 0,4 0.5,7.9 1.3,11.7 -42.6,-2.1 -80.4,-22.6 -105.7,-53.6 -4.4,7.6 -6.9,16.4 -6.9,25.8 0,17.8 9.1,33.5 22.8,42.7 -8.4,-0.3 -16.3,-2.6 -23.2,-6.4 0,0.2 0,0.4 0,0.7 0,24.8 17.7,45.6 41.1,50.3 -4.3,1.2 -8.8,1.8 -13.5,1.8 -3.3,0 -6.5,-0.3 -9.6,-0.9 6.5,20.4 25.5,35.2 47.9,35.6 -17.6,13.8 -39.7,22 -63.7,22 -4.1,0 -8.2,-0.2 -12.2,-0.7 22.6,14.4 49.6,22.9 78.5,22.9" id="path7" /></g><g id="Annotations"></g></g></svg>
    </a>
</div>
`
const renderErr = (id, msg) => `
<div id="${id}" class="${styles.error}">
    ${msg}
</div>
`
const renderBest = val => {
    return `Best Time: ${!!val ? val.toFixed(2) + "s": "n/a"}`
}
const render = (images, level, time) => {
    return `
        ${imgBtn(PREV, images.arrow, styles.prevBtn)}
        ${lock}
        ${twitter}
        <div class="${styles.infoTitle}" id="${INFO}">${"Level " + level}</div> 
        <div class="${styles.infoTitle} ${styles.infoSub}" id="${BEST_TIME}">${renderBest(time)}</div>
        ${imgBtn(NEXT, images.arrow)}
        ${btn(START, "START")}
    `
}

export default ({ onStart, uiRoot, storage, level, maxLevel, images, assetsCache, contSound, chSound, errSound }) => {
    let levelState = level
    uiRoot.content = render(images, level, storage.getHiscore(levelState))

    const prevBtn = uiRoot.get(`#${PREV}`)
    const nextBtn = uiRoot.get(`#${NEXT}`)
    const startBtn = uiRoot.get(`#${START}`)
    const levelInfo = uiRoot.get(`#${INFO}`)
    const lockInd = uiRoot.get(`#${LOCK}`)
    const bestTime = uiRoot.get(`#${BEST_TIME}`)
    const twitter = uiRoot.get(`#${TWITTER}`)

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
        twitter.pos = calcStacked(bestTime, twitDims, "bottom", 0, 20)
    }
    const realign = viewport => {
        realignTxt(viewport)
        prevBtn.pos = calcAligned(viewport, prevBtn, "left", "center", paddingX)
        nextBtn.pos = calcAligned(viewport, nextBtn, "right", "center", -paddingX)
        startBtn.pos = calcStacked(bestTime, startBtn, "bottom", 0,  64)
    }
    const updateBtnVis = (level, maxLevel) => {
        lockInd.domNode.style.opacity = level <= maxLevel || level > levels.length ? 0: 1
        startBtn.domNode.style.opacity = level <= maxLevel ? 1: 0
        twitter.domNode.style.opacity = level > levels.length ? 1: 0 // show twitter link on the "coming soon" screen   
    }
    const onPrevBtnClick = () => {
        if (levelState === 1) return errSound.play()
        levelState = Math.max(levelState - 1, 1)
        const best = storage.getHiscore(levelState)
        bestTime.content = renderBest(best)
        levelInfo.content = `Level ${levelState}`
        updateBtnVis(levelState, maxLevel)
        realignTxt(config.viewport)
        chSound.play()
    }
    const onNextBtnClick = () => {
        if (levelState > levels.length) return errSound.play()
        levelState = Math.min(levelState  + 1, levels.length + 1)
        const best = storage.getHiscore(levelState)
        levelInfo.content = levelState <= levels.length ? `Level ${levelState}`: "Coming Soon"
        bestTime.content = levelState <= levels.length ? renderBest(best): "new level every week"
        updateBtnVis(levelState, maxLevel)
        realignTxt(config.viewport)
        chSound.play()
    }
    const onStartBtnClick = () => {
        if (levelState > maxLevel) { return  errSound.play() }
        const levelId = levels[levelState - 1].id
        config.viewport.off("change", realign)
        uiRoot.clear()
        contSound.play()
        if (!assetsCache.get(levelId)) {
            uiRoot.content = loadingDot(LOADING)
            const loadingInd = uiRoot.get(`#${LOADING}`)
            loadingInd.pos = calcAligned(config.viewport, loadingInd, "center", "center")
            levels.forEach(level => {
                assetsCache.unload(level.id)
            })
            assetsCache.load([ levelId ])
            assetsCache.once("load", () => {
                onStart(levelState)
            })
            assetsCache.on("error", () => {
                uiRoot.content = renderErr(ERROR, "No Internet")
                const errMsg = uiRoot.get(`#${ERROR}`)
                errMsg.pos = calcAligned(config.viewport, errMsg, "center", "center")
            })
            return
        }
        onStart(levelState)
    }
    const onKeyDown = e => {
        const keyCode = e.which || e.keyCode
        if (!!keyCode) {
            switch(keyCode) {
                case 37: // left arrow
                case 65: // A
                    onPrevBtnClick()
                break
                case 39: // right arrow
                case 68: // D
                    onNextBtnClick()
                break
                default: // rest of the keys
                    onStartBtnClick()
            }
            return
        }

        switch(e.key) {
            case "Left": // for IE and Older Versions of Edge
            case "ArrowLeft": // Standard
            case "D":
            case "d":
                onPrevBtnClick()
            break
            case "Right":
            case "ArrowRight":
            case "A":
            case "a":
                onNextBtnClick()
            break
            default:
                onStartBtnClick()
            break
        }
    }
    
    if (config.isMobile === false) document.addEventListener("keydown", onKeyDown)
    prevBtn.on("click", onPrevBtnClick)
    nextBtn.on("click", onNextBtnClick)
    startBtn.on("click", onStartBtnClick)
    config.viewport.on("change", realign)
    realign(config.viewport)
    return () => {
        if (config.isMobile === false) document.removeEventListener("keydown", onKeyDown)
        prevBtn.off("click", onPrevBtnClick)
        nextBtn.off("click", onNextBtnClick)
        startBtn.off("click", onStartBtnClick)
    }
}