import Gate from "@entities/gate"

const getDefault = EClass => (x, y, props) => {
    return new EClass({
        pos: { x, y },
        ...props
    })
}

export default soundSprite => {
    // const gColSound = soundSprite.createPool("")
    const gMovSound = soundSprite.createPool("gate")
    return ({
        gate: (x, y, props) => {
            return new Gate({
                pos: { x, y },
                colSound: null,
                movSound: gMovSound,
                ...props
            })
        }
    })
}