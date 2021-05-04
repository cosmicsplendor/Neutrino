import Node from "@lib/baseEntities/Node"
export { default as detectShape, shapes } from "./detectShape" 

export const center = entity => {
    const { hitbox, hitcirc } = entity

    if (entity.hitbox) {
        return { x: hitbox.x + hitbox.width / 2, y: hitbox.y + hitbox.height / 2 }
    }

    if (entity.hitcirc) {
        return { x: hitcirc.x, y: hitcirc.y }
    }

    return { x: entity.width / 2, y: entity.height / 2 }
}

export function rectBounds(ent) {
    const { hitbox } = ent
    const globalPos = Node.globalPos(ent)
    return hitbox ?
    { ...hitbox, x: globalPos.x + hitbox.x, y: globalPos.y + hitbox.y }:
    { ...globalPos, width: ent.width, height: ent.width }
}

export function hitbox(ent) {
    return ent.hitbox ? { ...ent.hitbox }: { x: 0, y: 0, width: ent.width, height: ent.height }
}

export function circBounds(ent) {
    const { hitcirc } = ent
    const globalPos = Node.globalPos(ent)
    return {
        ...hitcirc, x: globalPos.x + hitcirc.x, y: globalPos.y + hitcirc.y
    }
}