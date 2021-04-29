import { math } from "@lib"
import detectShape, { shapes } from "./detectShape"

export default getTestFn = (e1, e2) => {
    const e1Shape = detectShape(e1)
    const e2Shape = detectShape(e2)

    if (e1Shape === shapes.RECT && e2Shape === shapes.RECT) {
        return math.aabb
    } 
    if (e1Shape === shapes.CIRC && e2Shape === shapes.CIRC) {
        return math.circCirc
    } 
    if (e1Shape === shapes.CIRC && e2Shape === shapes.RECT) {
        return (e1, e2) => math.aabbCirc({ circ: e1, rect: e2 })
    }
    if (e1Shape === shapes.RECT && e2Shape === shapes.CIRC) {
        return (e1, e2) => math.aabbCirc({ circ: e2, rect: e1 })
    }
}
