import * as types from "../entities/core/types"

class Canvas2DRenderer {
    constructor({ canvasId, scene }) {
        this.canvas = document.querySelector(`#${canvasId}`)
        this.scene = scene
        this.ctx = this.canvas.getContext("2d")
    }
    render(node) {
        const { type, pos, rotation, scale, pivot, anchor, initialRotation, initialPivotX } = node

        
        this.ctx.translate(pos.x, pos.y)
        this.ctx.rotate(Math.PI * initialRotation / 180)
        this.ctx.translate(pivot.x, pivot.y)
        this.ctx.translate(anchor.x, anchor.y)
        this.ctx.rotate(Math.PI * rotation / 180)
        this.ctx.translate(-anchor.x, -anchor.y)
        this.ctx.translate(pivot.x, pivot.y)
        this.ctx.scale(scale.x, scale.y)
        
        switch(type) {
            case types.texture:
                this.ctx.drawImage(node.img, 0, 0)
            break
            case types.rect:
                this.ctx.fillStyle = node.fill
                this.ctx.fillRect(0, 0, node.width, node.height)
                if (node.stroke) {
                    this.ctx.strokeStyle = node.stroke
                    this.ctx.strokeRect(0, 0, node.width, node.height)
                }
            break
            case types.texregion:
                const { x, y } = node.meta[node.frame]
                const {  w, h } = node
                this.ctx.drawImage(node.texture.img, x, y, w, h, 0, 0, w, h)
            break
            case types.text:

            break
            case types.sprite:

            break
        }
    }
    renderRecursively(node) {
        node = node || this.scene

        node === this.scene && this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.save()
        this.render(node)
        for (const childNode of node.children) {
            this.renderRecursively(childNode)
        }
        this.ctx.restore()
    }
}

export default Canvas2DRenderer