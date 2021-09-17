const { TexRegion } = require("@lib/entities");
import Movement from "@lib/components/Movement";
import config from "@config"
import { sign } from "@utils/math"

const defaultSeq = `
[
    { 
        "jumpTo": 1008,
        "speed": 500,
        "acc": 1000,
        "velX": 200
    },
    {
        "rollTo": 2664,
        "speed": 118
    }
]
`

// tutorial ball
class Ball extends TexRegion {
    constructor(x, y, seq=defaultSeq, player) {
        super({ frame: "ball", pos: { x, y } })
        this.pos0 = { x, y }
        this.player = player
        this.tint = [ 0.05, 0, -0.05, 0 ]
        this.anchor = { x: this.width / 2, y: this.height / 2 }
        this.radius = this.width / 2
        this.alpha = 0.7
        // Object.assign(this, makeFlashMixin(0.5))
        Movement.makeMovable(this, { roll: true })
        this.seqs = JSON.parse(seq)
        this.seqIdx = -1
        this.seq = null
        this.nextSeq()
    }
    reset() {}
    nextSeq() {
        this.seqIdx++
        if (this.seqIdx > this.seqs.length - 1) {
            this.seqIdx = 0
            this.pos.x = this.pos0.x
            this.pos.y = this.pos0.y
        }
        this.seq = this.seqs[this.seqIdx]
        if (this.seq.jumpTo) {
            this.velSign = sign(this.seq.jumpTo - this.pos.y)
            this.velY = this.velSign * this.seq.speed
            this.velX = this.seq.velX || 0
            this.accY = this.seq.acc || config.gravity
        } else if (this.seq.rollTo) {
            this.velSign = sign(this.seq.rollTo - this.pos.x)
            this.accY = 0
            this.velX = this.velSign * this.seq.speed
            this.velY = 0
        }
    }
    checkSeq() {
        if (this.seq.jumpTo) {
            if (this.pos.y * this.velSign > this.seq.jumpTo * this.velSign) {
                this.pos.y = this.seq.jumpTo
                this.nextSeq()
            }
        } else if (this.seq.rollTo) {
            if (this.pos.x * this.velSign > this.seq.rollTo * this.velSign) {
                this.pos.x = this.seq.rollTo
                this.nextSeq()
            }
        }
    }
    update(dt) {
        // this.updateFlash(dt)
        Movement.update(this, dt)
        this.checkSeq()
    }
}

const makeFlashMixin = period => ({
    alpha: 0.7,
    elapsed: 0,
    period: period || 0.6,
    updateFlash(dt) {
        this.elapsed += dt
        if (this.elapsed > this.period) {
            this.elapsed = 0
            switch(this.alpha) {
                case 0.7:
                    this.alpha = 0.6
                break
                case 0.6:
                    this.alpha = 0.7
            }
        }
    }
})

export default Ball