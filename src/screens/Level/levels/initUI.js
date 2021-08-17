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
    const onViewportChange = ({ scale, ...viewport }) => {
        if (!ctrlBtns) { return }
        ctrlBtns.left.pos = calcAligned(viewport, ctrlBtns.left.bounds, "left", "bottom", margin / scale, -margin / scale)
        ctrlBtns.right.pos = calcAligned(viewport, ctrlBtns.right.bounds, "left", "bottom", 40 / scale + (ctrlBtns.left.bounds.width * scale), -margin / scale)
        ctrlBtns.axn.pos = calcAligned(viewport, ctrlBtns.right.bounds, "right", "bottom", -margin / scale, -margin / scale)
    }
    onViewportChange(config.viewport)
    config.viewport.on("change", onViewportChange)
    return () => {
        config.viewport.off("change", onViewportChange)
        uiRoot.clear()
    }
}