import { calcAligned } from "@utils/entity"
import config from "@config"
const margin = 20
export default (uiRoot, player) => {
    const ctrlBtns = config.isMobile && player.getCtrlBtns()
    if (ctrlBtns) {
        uiRoot.add(ctrlBtns.left)
              .add(ctrlBtns.right)
              .add(ctrlBtns.axn)
    }
    const onViewportChange = ({ width, height, scale }) => {
        if (!ctrlBtns) { return }
        const viewport = { width: width, height: height }
        ctrlBtns.left.pos = calcAligned(viewport, ctrlBtns.left.bounds, "left", "bottom", margin / scale, -margin / scale)
        ctrlBtns.right.pos = calcAligned(viewport, ctrlBtns.right.bounds, "left", "bottom", 30 / scale + ctrlBtns.left.bounds.width, -margin / scale)
        ctrlBtns.axn.pos = calcAligned(viewport, ctrlBtns.right.bounds, "right", "bottom", -margin / scale, -margin / scale)
    }
    onViewportChange(config.viewport)
    config.viewport.on("change", onViewportChange)
    return () => {
        config.viewport.off("change", onViewportChange)
        uiRoot.clear()
    }
}