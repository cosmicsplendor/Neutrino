export { default as detectShape, shapes } from "./detectShape" 

export const  getReusableBounds = (() => {
    const bounds = Array(2).fill(0).map(() => ({ x: 0, y: 0, width: 0, height: 0 }))
    let lastAccessedIdx = 0
    return (x, y, width, height) => {
        lastAccessedIdx = lastAccessedIdx === 0 ? 1: 0
        bounds[lastAccessedIdx].x = x
        bounds[lastAccessedIdx].y = y
        bounds[lastAccessedIdx].width = width
        bounds[lastAccessedIdx].height = height
        return bounds[lastAccessedIdx]
    }
})()

export const  getReusableCoords = ((size) => {
    const coords = { x: 0, y: 0 }
    return (x, y) => {
        coords.x = x
        coords.y = y
        return coords
    }
})()

export const getReusableCirc =(() => {
    const circ = { x: 0, y: 0, radius: 0 }
    return (x, y, radius) => {
        circ.x = x
        circ.y = y
        circ.radius = radius
        return circ
    }
})()

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


const xAlignmentCalcs = Object.freeze({
    left: () => 0,
    center: (container, entity) => (container.width - entity.width) / 2,
    right: (container, entity) => container.width - entity.width
})

const yAlignementCalcs =  Object.freeze({
    top: () => 0,
    center: (container, entity) => (container.height - entity.height) / 2,
    bottom: (container, entity) => container.height - entity.height
})

export function calcAligned(container, entity, x, y, offsetX=0, offsetY=0) {
    const x = xAlignmentCalcs[x](container, entity) + offsetX
    const y = yAlignementCalcs[y](container, entity) + offsetY
    return { x, y }
}

export function calcCentered(container, entity) {
    return {
        x: xAlignmentCalcs.center(container, entity),
        y: yAlignementCalcs.center(container, entity)
    }
}

export function rectBounds(ent) {
    const globalPos = getGlobalPos(ent)
    if (ent.hitbox) {
        return getReusableBounds(globalPos.x + ent.hitbox.x, globalPos.y + ent.hitbox.y, ent.hitbox.width, ent.hitbox.height)
    }
    return getReusableBounds(globalPos.x, globalPos.y, ent.width, ent.height)
}

export function getHitbox(ent) {
    if (ent.hitbox) {
        return ent.hitbox
    }
    return getReusableBounds(0, 0, ent.width, ent.height)
}

export function circBounds(ent) {
    const globalPos = getGlobalPos(ent)
    return getReusableCirc(globalPos.x + ent.hitCirc.x, globalPos.y + ent.hitCirc.y, ent.hitCirc.radius)
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
    return getReusableCoords(x, y)
}