import * as types from "@lib/entities/types"
import { getHitbox } from "@lib/utils/entity"
import Rect from "@lib/entities/Rect"
class Canvas2DRenderer {
    constructor({ canvasID, scene, width, height, background="#fff" }) {
        const canvas = document.querySelector(`#${canvasID}`)
        this.canvas = canvas
        this.scene = scene
        this.ctx = canvas.getContext("2d")
        
        this.changeBackground(background)
        this.resize({ width, height})
    }
    changeBackground(newBackground) {
        this.canvas.style.background = newBackground
    }
    resize({ width, height }) {
        this.canvas.setAttribute("width", width)
        this.canvas.setAttribute("height", height)
    }
    render(node) {
        this.ctx.translate(Math.floor(node.pos.x), Math.floor(node.pos.y))
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
        if (!!node.invisible) { return }
        if (this.scene.intersects && !this.scene.intersects(node)) { return }
        if (node === this.scene) { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) }

        this.ctx.save()
        if (node.alpha) {
            this.ctx.globalAlpha = node.alpha
        }
        this.render(node)
        if (node.debug) {
            const hitbox = getHitbox(node)
            this.render(new Rect({ pos: { ...hitbox }, ...hitbox, stroke: "red", fill: "rgba(0, 0, 0, 0)"}))
        }
        for (const childNode of node.children) {
            this.renderRecursively(childNode)
        }
        this.ctx.restore()
    }
}

export default Canvas2DRenderer