import { Node } from "@lib"
import Rect from "@lib/entities/Rect"
import Collision from "@lib/components/Collision"

export default (pos = { x: 0, y: 0 }) => {
    const bullet = new Rect({ width: 5, height: 5, fill: "orangered", pos })
    bullet.vel = { x: 1000 , y: 0 }

    const wallCollision = new Collision({
        entity: bullet, blocks: "wall", onHit: block => {
            bullet.remove()
            block.remove()
        }
    })
    Node.get("root").add(bullet)
    bullet.update = dt => {
        bullet.pos.x += bullet.vel.x * dt
        wallCollision.update()
    }
    return bullet
}