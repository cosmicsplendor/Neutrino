import styles from "./style.css"
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