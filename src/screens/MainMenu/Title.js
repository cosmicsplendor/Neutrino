import { TexRegion, Node } from "@lib"
import { compositeDims } from "@utils/entity"

class Title extends Node {
    constructor() {
        super()
        this.logo = new TexRegion({ frame: "logo" })
        this.rock1 = new TexRegion({ frame: "rock1" })
        this.rock2 = new TexRegion({ frame: "rock2" })
        this.rock1.pos.x = 200
        this.rock2.pos.y += this.rock2.h / 2
        this.rock2.rotation = -Math.PI / 12
    
            this.rock1.anchor = {
                x: this.rock1.w / 2,
                y: this.rock1.h / 2
            }
            this.rock1.rotation = Math.PI / 6
        this.rock2.anchor = {
            x: this.rock2.w * 0.75,
            y: this.rock2.h / 2
        }
        for (let i = 0; i < 150; i++) {
            const ball = new TexRegion({ frame: "ball" })

            ball.pos.x = Math.random() * 1000
            ball.pos.y = Math.random() * 800

    
            ball.anchor = {
                x: ball.w * 0.75,
                y: ball.h / 2
            }
            ball.rotation = 0
    
     
            console.log(ball.pos.x)
            this.add(ball)
        }

        // this.add(this.rock1)
        // this.add(this.rock2)
        // this.add(this.logo)

        this.alpha = 0.01
        Object.assign(this, compositeDims(this))
    }
    update(dt) {
        // this.ball.rotation += dt * Math.PI / 12
        // this.alpha = Math.min(1, this.alpha + 0.5 * dt)
    }
}

export default Title