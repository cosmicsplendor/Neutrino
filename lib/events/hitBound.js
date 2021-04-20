import Event from "./Event"
import { math } from "@lib"
import config from "@config"

const { viewport } = config

const hitBoundEvent = new Event("hit-bound")
hitBoundEvent.check = function(subscriber) {
    const { entity, callback } = subscriber
    const { pos, width } = entity
    if (pos.x < 0 || pos.x + width > viewport.width) {
        pos.x = math.clamp(0, viewport.width - width, pos.x)
        callback()
    }
}

export default hitBoundEvent