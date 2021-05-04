import { circBounds, rectBounds } from "../utils/entity"

export const rand = (to, from = 0) => from + Math.floor((to + 1)* Math.random())

export const skewedRand = (to, from = 0) => from + Math.floor((to + 1) * Math.random() * Math.random())

export const clamp = (from, to, num) => Math.min(to, Math.max(from, num))

export const aabb = (e1, e2) => {
    if (!!e1.invisible || !!e2.invisible) {
        return
    }

    const e1Bounds = rectBounds(e1)
    const e2Bounds = rectBounds(e2)
    if (
        e1Bounds.x + e1Bounds.width <= e2Bounds.x || 
        e1Bounds.x >= e2Bounds.x + e2Bounds.width ||
        e1Bounds.y + e1Bounds.height <= e2Bounds.y ||
        e1Bounds.y >= e2Bounds.y + e2Bounds.height
    ) {
            return false
    }
    return true
}

export const circCirc = (e1, e2) => {
    const e1Bounds = circBounds(e1)
    const e2Bounds = circBounds(e2)

    const radiiSum = e1Bounds.radius + e2Bounds.radius
    const xDist = e1Bounds.x - e2Bounds.x
    const yDist = e1Bounds.y - e2Bounds.y
    const sqDist = xDist * xDist + yDist * yDist

    return sqDist <= radiiSum * radiiSum
}

export const aabbCirc = ({ circ, rect }) => {
    const cBounds = circBounds(circ)
    const rBounds = rectBounds(rect)

    const closestX = clamp(cBounds.x, rBounds.x, rBounds.x + rBounds.width)
    const closestY = clamp(cBounds.y, rBounds.y, rBounds.y + rBounds.height)

    const sqClosestDist = closestX * closestX + closestY * closestY

    return sqClosestDist <= cBounds.radius * cBounds.radius
}

export const contains = ({ box, point }) => {
    const xcond = point.x > box.x && point.x < box.x + box.width
    const ycond = point.y > box.y && point.y < box.y + box.height
    return xcond && ycond
}