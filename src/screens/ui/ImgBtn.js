import styles from "./style.css"
export default (id, img) => {
    return `
    <div 
        class="${styles.playBtn}" 
        id="${id}" 
        style="width: ${img.width}px; height: ${img.height}px; background: url(${img.src});"
    >
    </div>
    `
}