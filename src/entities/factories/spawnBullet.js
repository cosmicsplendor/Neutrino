import { Node } from "@lib"
import Rect from "@lib/entities/Rect"
import Pool from "@utils/Pool"
import { pickOne } from "@utils/math"

const colors = [ "#ff0099", "#  ffcc00", "#aa00aa", "#9900ff" ]

const BulletFactory = () => {
    const bullet = new Rect({ width: 5, height: 5, fill: pickOne(colors) })
    bullet.velX = 500

    Node.get("root").add(bullet)
    bullet.update = dt => {
        bullet.pos.x += bullet.velX * dt
    }
    return bullet
}

const BulletPool = new Pool({ factory: BulletFactory, fixed: true, size: 3, free: bullet => { 
	bullet.fill = pickOne(colors)
} })


const spawnBullet = (pos = { x: 0, y: 0 }) => {
    const bullet = BulletPool.create()
    bullet.pos.x = pos.x
    bullet.pos.y = pos.y
    return bullet
}

export default spawnBullet