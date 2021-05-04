import { Rect, Node } from "@lib"
import Collision from "@lib/components/Collision"

export default (pos = { x: 0, y: 0 }) => {
    const bullet = new Rect({ width: 5, height: 5, fill: "white", pos })
    bullet.vel = { x: 1000 , y: 0 }

    const collision = new Collision({
        entity: bullet, blocks: "wall", callback: block => {
            bullet.remove()
            block.remove()
        }
    })
    Node.get("root").add(bullet)
    bullet.update = dt => {
        bullet.pos.x += bullet.vel.x * dt
        collision.update()
    }
    return bullet
}