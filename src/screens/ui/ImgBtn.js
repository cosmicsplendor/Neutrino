import UI from "@utils/UI"
import styles from "./style.css"

export const dom = (img, class_) => {
    const el = UI.create("div")
    el.domNode.setAttribute("class", `${styles.imgBtn} ${class_ || ''}`)
    el.domNode.setAttribute("style", `width: ${img.width}px; height: ${img.height}px; background: url(${img.src});`)
    el.width = img.width
    el.height = img.height
    return el
}
export default (id, img, class_) => {
    return `
    <div 
        class="${styles.imgBtn} ${class_ || ''}" 
        id="${id}" 
        style="width: ${img.width}px; height: ${img.height}px; background: url(${img.src});"
    >
    </div>
    `
}