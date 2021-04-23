export default class Vec2 {
    constructor({ x = 0, y = 0 }) {
        this.x = x
        this.y = y
    }
    add(a) {
        return new Vec2({ x: this.x + a.x , y: this.y + a.y })
    }
    subtract(a) {
        return new Vec2({ x: this.x - a.x, y: this.y - a.y })
    }
    multiply(n) {
        return new Vec2({ x: n * this.x, y: n * this.y })
    }
    dot(a) {
        return this.x * a.x + this.y * a.y
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    normalize() {
        return this.multiply(1 / this.magnitude())
    }
    static toObject(a) {
        return { x: a.x, y: a.y }
    }
}