export const rand = (to, from = 0) => from + Math.floor((to - from + 1)* Math.random())

export const randf = (to, from = 0) => from + (to - from) * Math.random()

export const skewedRand = (to, from = 0) => from + Math.floor((to - from + 1) * Math.random() * Math.random())

export const pickOne = array => array[rand(array.length - 1)]

export const clamp = (from = 0, to = 1, num) => Math.min(to, Math.max(from, num))

export const sign = num => num / Math.abs(num)

export const lerp = (from, to, num) => (num - from) / (to - from)

export const stripFloat = (num, place) => Math.floor(num * place) / place

export const roundFloat = (num, place) => Math.round(num * place) / place


export const easingFns = {
    linear(x) {
        return x
    },
    quadIn(x) {
        return  x * x
    },
    quadOut(x) {
        return 1 - this.quadIn(x - 1)
    },
    cubicIn(x) {
        return x * x * x
    },
    cubicOut(x) {
        return 1 - this.cubicIn(1 - x)
    },
    smoothStep(x) {
        return x * x * (3 - 2 * x)
    }
}

export const fixedAabb = (b1, b2) => {
    if (
        stripFloat(b1.x + b1.width, 10000) <= stripFloat(b2.x, 10000) || 
        stripFloat(b1.x, 10000) >= stripFloat(b2.x + b2.width, 10000) ||
        stripFloat(b1.y + b1.height, 10000) <= stripFloat(b2.y, 10000) ||
        stripFloat(b1.y, 10000) >= stripFloat(b2.y + b2.height, 10000)
    ) {
            return false
    }
    return true
}

export const aabb = (b1, b2) => {
    if (
        b1.x + b1.width <= b2.x || 
        b1.x >= b2.x + b2.width ||
        b1.y + b1.height <= b2.y ||
        b1.y >= b2.y + b2.height
    ) {
            return false
    }
    return true
}

export const circCirc = (b1, b2) => {
    const radiiSum = b1.radius + b2.radius
    const xDist = b1.x - b2.x
    const yDist = b1.y - b2.y
    const sqDist = xDist * xDist + yDist * yDist

    return sqDist <= radiiSum * radiiSum
}

export const aabbCirc = ({ circBounds, rectBounds }) => {
    const closestX = clamp(circBounds.x, rectBounds.x, rectBounds.x + rectBounds.width)
    const closestY = clamp(circBounds.y, rectBounds.y, rectBounds.y + rectBounds.height)

    const sqClosestDist = closestX * closestX + closestY * closestY

    return sqClosestDist <= circBounds.radius * circBounds.radius
}


export const contains = ({ box, point }) => {
    const xcond = point.x > box.x && point.x < box.x + box.width
    const ycond = point.y > box.y && point.y < box.y + box.height
    return xcond && ycond
}