export const shapes = {
    RECT: "rectangle",
    CIRC: "circle"
}
export default entity => {
    const shape = !!entity.hitCirc ? shapes.CIRC: shapes.RECT
    if (shape === shapes.RECT && !entity.hitbox && !entity.width & !entity.height) {
        throw new Error(`Unable to determine entity shape: \n${JSON.stringify(entity, null, 3)}`)
    }
    return shape
}