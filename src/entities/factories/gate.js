import Gate from "../Gate"

export default (x, y, props) => {
    return new Gate({
        pos: { x, y },
        ...props
    })
}