import * as types from "@lib/entities/types"
import Rect from "@lib/entities/Rect"

class Canvas2DRenderer {
    constructor({ canvasID, scene, viewport, background="#fff" }) {
        const canvas = document.querySelector(`#${canvasID}`)
        this.canvas = canvas
        this.scene = scene
        this.ctx = canvas.getContext("2d")

        this.changeBackground(background)
        this.resize(viewport)
        viewport.on("change", this.resize.bind(this))
    }
    changeBackground(newBackground) {
        this.canvas.style.background = newBackground
    }
    resize(viewport) {
        this.canvas.setAttribute("width", viewport.width)
        this.canvas.setAttribute("height", viewport.height)
    }
    render(node) {
        this.ctx.translate(Math.round(node.pos.x), Math.round(node.pos.y))
        if (node.initialRotation) {
            this.ctx.rotate(node.initialRotation)
            this.ctx.translate(node.initialPivotX, 0)
        }
    
        node.anchor && this.ctx.translate(node.anchor.x, node.anchor.y)
        node.rotation && this.ctx.rotate(node.rotation)
        node.anchor && this.ctx.translate(-node.anchor.x, -node.anchor.y)
        node.pivot && this.ctx.translate(node.pivot.x, node.pivot.y)
        node.scale && this.ctx.scale(node.scale.x, node.scale.y)
        switch(node.type) {
            case types.texregion:
                this.ctx.drawImage(node.img, node.meta.x, node.meta.y, node.w, node.h, 0, 0, node.w, node.h)
            break
            case types.texture:
                this.ctx.drawImage(node.img, 0, 0)
            break
            case types.rect:
                this.ctx.fillStyle = node.fill
                this.ctx.fillRect(0, 0, node.width, node.height)
                if (node.stroke) {
                    this.ctx.strokeStyle = node.stroke
                    this.ctx.lineWidth = node.strokeWidth
                    this.ctx.strokeRect(0, 0, node.width, node.height)
                }
            break
        }
    }
    renderRecursively(node = this.scene) {
        if (!node._visible) { return }
        if (node.alpha === 0) { return }
        if (node === this.scene) { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) }

        this.ctx.save()
        if (node.alpha) {
            this.ctx.globalAlpha = node.alpha
        }
        if (node.blendMode) {
            this.ctx.globalCompositeOperation = node.blendMode
        }
        this.render(node)
        if (node.debug) {
            const hitbox = node.hitbox || getHitbox(node)
            this.ctx.save()
            this.render(new Rect({ pos: { ...hitbox }, ...hitbox, stroke: "red", fill: "rgba(0, 64, 128, 0.2)", strokeWidth: 10  }))
            this.ctx.restore()
        }
        if (node.children) {
            for (let i = 0, len = node.children.length; i < len; i++) {
                this.renderRecursively(node.children[i])
            }
        }
        this.ctx.restore()
    }
}

export default Canvas2DRenderer