import Canvas2dRenderer from "./Canvas2D"
import Webgl2Renderer from "./Webgl2"
import config from "@config"

export default params => {
    let renderer
    try {
        if (config.devMode) throw new Error("Using 2d canvas for dev mode")
        renderer = new Webgl2Renderer(params)
    } catch(e) {
        console.log(e)
        console.log("Webgl 2 not supported.. resorting to Canvas2D")
        renderer = new Canvas2dRenderer(params)
    }
    return renderer
}