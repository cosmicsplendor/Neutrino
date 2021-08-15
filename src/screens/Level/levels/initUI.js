import UI from "@utils/UI"
import { calcAligned } from "@utils/entity"
import config from "@config"
export default (uiRoot, player) => {
    const ctrlBtns = config.isMobile && player.getCtrlBtns()
    if (ctrlBtns) {
        uiRoot.add(ctrlBtns.left)
              .add(ctrlBtns.right)
              .add(ctrlBtns.axn)
    }
    const onViewportChange = viewport => {
        if (!ctrlBtns) { return }
        ctrlBtns.left.pos = calcAligned(viewport, ctrlBtns.left.bounds, "left", "bottom", 20, -20)
        ctrlBtns.right.pos = calcAligned(viewport, ctrlBtns.right.bounds, "left", "bottom", 30 + ctrlBtns.left.bounds.width, -20)
        ctrlBtns.axn.pos = calcAligned(viewport, ctrlBtns.right.bounds, "right", "bottom", -20, -20)
    }
    onViewportChange(config.viewport)
    config.viewport.on("change", onViewportChange)
    return () => {
        config.viewport.off("change", onViewportChange)
        uiRoot.clear()
    }
}