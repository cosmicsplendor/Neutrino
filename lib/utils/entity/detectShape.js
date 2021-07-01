import { PLANK } from "@lib/constants"
export const shapes = Object.freeze({
    RECT: "rectangle",
    CIRC: "circle",
    PLANK: "plank" // inclined-plane
})
export default entity => {
    let shape
    if (!!entity.hitCirc) {
        shape = shapes.CIRC
    } else if (!!entity.type === PLANK) {
        shape = shapes.PLANK
    } else {
        shape = shapes.RECT
    }
    if (shape === shapes.RECT && !entity.hitbox && !entity.width & !entity.height) {
        throw new Error(`Unable to determine entity shape: \n${JSON.stringify(entity, null, 3)}`)
    }
    return shape
}