import { Node } from "@lib"
export const rand = (to, from = 0) => from + Math.floor((to + 1)* Math.random())

export const skewedRand = (to, from = 0) => from + Math.floor((to + 1) * Math.random() * Math.random())

export const clamp = (from, to, num) => Math.min(to, Math.max(from, num))

export const aabb = (e1, e2) => {
    if (!!e1.invisible || !!e2.invisible) {
        return
    }

    const e1Bounds = bounds(e1)
    const e2Bounds = bounds(e2)
    if (
        e1Bounds.x + e1Bounds.width < e2Bounds.x || 
        e1Bounds.x > e2Bounds.x + e2Bounds.width ||
        e1Bounds.y + e1Bounds.height < e2Bounds.y ||
        e1Bounds.y > e2Bounds.y + e2Bounds.height
    ) {
            return false
    }
    return true
}

function bounds(ent) {
    const { hitbox } = ent
    const globalPos = Node.globalPos(ent)
    return ent.hitbox ?
    { ...hitbox, x: globalPos.x + hitbox.x, y: globalPos.y + hitbox.y }:
    { ...globalPos, width: ent.width, height: ent.width }
}