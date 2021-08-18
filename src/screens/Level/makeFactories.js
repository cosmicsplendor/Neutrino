import Gate from "@entities/gate"

const getDefault = EClass => (x, y, props) => {
    return new EClass({
        pos: { x, y },
        ...props
    })
}

export default soundSprite => { // using sound sprite to create and pass objects and (cached) pools so that objects can just consume sound in ready-to-use form rather than by creating them on their own. This helps me make sound creation parameters changes at one place, making code more scalable.
    // const gColSound = soundSprite.createPool("")
    const gMovSound = soundSprite.createPool("gate")
    return ({
        gate: (x, y, props, player) => {
            return new Gate({
                pos: { x, y },
                colSound: null,
                movSound: gMovSound,
                player,
                ...props
            })
        }
    })
}