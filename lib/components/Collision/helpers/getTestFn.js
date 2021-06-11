import { aabbCirc, aabb, fixedAabb, circCirc } from "@lib/utils/math"
import { shapes, detectShape, rectBounds, circBounds } from "@lib/utils/entity"

const getAabbTestFn = fixed => {
    const test = fixed ? fixedAabb: aabb
    return (e1, e2) => {
        const e1Bounds = rectBounds(e1)
        const e2Bounds = rectBounds(e2)
        return test(e1Bounds, e2Bounds)
    }
}

const testCircCirc = (e1, e2) => {
    const e1Bounds = circBounds(e1)
    const e2Bounds = circBounds(e2)
    return circCirc(e1Bounds, e2Bounds)
}

const testAabbCirc = ({ circ, rect }) => {
    return aabbCirc({ 
        circBounds: circBounds(circ),
        rectBounds: rectBounds(rect)
    })
    
}

export default (e1, e2, { rigid, movable }) => {
    const e1Shape = detectShape(e1)
    const e2Shape = detectShape(e2)
    const fixed = rigid && movable

    if (e1Shape === shapes.RECT && e2Shape === shapes.RECT) {
        return getAabbTestFn(fixed)
    } 
    if (e1Shape === shapes.CIRC && e2Shape === shapes.CIRC) {
        return testCircCirc
    } 
    if (e1Shape === shapes.CIRC && e2Shape === shapes.RECT) {
        return (e1, e2) => testAabbCirc({ circ: e1, rect: e2 })
    }
    if (e1Shape === shapes.RECT && e2Shape === shapes.CIRC) {
        return (e1, e2) => testAabbCirc({ circ: e2, rect: e1 })
    }
}
