import styles from "./style.css"
export default (id) => {
    return `
        <div id="${id}">
            <div class="${styles.loadingDot} ${styles.dotA}"></div>
            <div class="${styles.loadingDot} ${styles.dotB}"></div>
            <div class="${styles.loadingDot} ${styles.dotC}"></div>
        </div>
    `
}