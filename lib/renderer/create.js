import Canvas2dRenderer from "./Canvas2D"
import Webgl2Renderer from "./Webgl2"

export default params => {
    let renderer
    try {
        // throw new Error()
        renderer = new Webgl2Renderer(params)
    } catch(e) {
        console.log("Webgl 2 not supported.. resorting to Canvas2D")
        renderer = new Canvas2dRenderer(params)
    }
    return renderer
}