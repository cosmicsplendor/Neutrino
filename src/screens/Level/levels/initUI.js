// import UI from "@utils/UI"
// import config from "@config"

// const render = () => {

// }

// export default (uiRoot, player) => {
//     const ctrlBtns = config.isMobile && player.getCtrlBtns
//     if (ctrlBtns) {
//         uiRoot.add(ctrlBtn.left)
//               .add(ctrlBtn.right)
//               .add(ctrlBtns.axn)
//     }
//     const onViewportChange = viewport => {
//         if (!ctrlBtns) { return }
        
//     }
//     config.viewport.on("change", onViewportChange)
//     return () => {
//         config.viewport.off("change", onViewportChange)
//     }
// }