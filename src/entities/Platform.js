import { Rect, math } from "@lib"
import * as events from "@lib/events"
import config from "@config"

const { viewport } = config

export default class Platform extends Rect {
    constructor(params) {
        super({ width: 100, height: 20, fill: "lavender", vel: { x: 200, y: 0 }, ...params })
        this.pos.y = viewport.height / 2 - 10
        this.vel = { x: 250, y: 0 }
    }
    add(node) {
        super.add(node)
        const vertOffset = -node.height || 0
        node.pos.y = vertOffset
    }
    update(dt) {
        const { pos, width, vel } = this
        pos.x += this.vel.x * dt
        if (pos.x < 0 || pos.x + width > viewport.width) {
            pos.x = math.clamp(0, viewport.width - width, pos.x)
            vel.x *= -1
        }
    }
}