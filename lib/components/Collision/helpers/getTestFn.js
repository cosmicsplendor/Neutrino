import { aabbCirc, aabb, circCirc} from "@lib/utils/math"
import { shapes, detectShape } from "@lib/utils/entity"

export default (e1, e2) => {
    const e1Shape = detectShape(e1)
    const e2Shape = detectShape(e2)

    if (e1Shape === shapes.RECT && e2Shape === shapes.RECT) {
        return aabb
    } 
    if (e1Shape === shapes.CIRC && e2Shape === shapes.CIRC) {
        return circCirc
    } 
    if (e1Shape === shapes.CIRC && e2Shape === shapes.RECT) {
        return (e1, e2) => aabbCirc({ circ: e1, rect: e2 })
    }
    if (e1Shape === shapes.RECT && e2Shape === shapes.CIRC) {
        return (e1, e2) => aabbCirc({ circ: e2, rect: e1 })
    }
}
