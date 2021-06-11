export { default as detectShape, shapes } from "./detectShape" 

export function  calcCenter(entity) {
    const { hitbox, hitcirc } = entity

    if (entity.hitbox) {
        return { x: hitbox.x + hitbox.width / 2, y: hitbox.y + hitbox.height / 2 }
    }

    if (entity.hitcirc) {
        return { x: hitcirc.x, y: hitcirc.y }
    }

    return { x: entity.width / 2, y: entity.height / 2 }
}

export function center(container, entity) {
    const x = (container.width - entity.width) / 2
    const y = (container.height - entity.height) / 2
    return { x, y }
}

export function rectBounds(ent) {
    const { hitbox } = ent
    const globalPos = getGlobalPos(ent)
    return hitbox ?
    { ...hitbox, x: globalPos.x + hitbox.x, y: globalPos.y + hitbox.y }:
    { ...globalPos, width: ent.width, height: ent.width }
}

export function getHitbox(ent) {
    return ent.hitbox ? { ...ent.hitbox }: { x: 0, y: 0, width: ent.width, height: ent.height }
}

export function circBounds(ent) {
    const { hitcirc } = ent
    const globalPos = getGlobalPos(ent)
    return {
        ...hitcirc, x: globalPos.x + hitcirc.x, y: globalPos.y + hitcirc.y
    }
}

export function setLocalPosX(node, globalPosX) {
    let parent = node.parent
    let localPosX
    while (parent) {
        localPosX = globalPosX - parent.pos.x
        parent = parent.parent
    }
    node.pos.x = localPosX
}
export function setLocalPosY(node, globalPosY) {
    let parent = node.parent
    let localPosY
    while (parent) {
        localPosY = globalPosY - parent.pos.y
        parent = parent.parent
    }
    node.pos.y = localPosY
}
export function getGlobalPos(node) {
    let x = node.pos.x
    let y = node.pos.y
    while (!!node.parent) {
        node = node.parent
        x += node.pos.x
        y += node.pos.y
    }
    return { x, y }
}