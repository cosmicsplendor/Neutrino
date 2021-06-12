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
        const { type, pos, rotation, scale, pivot, anchor } = node

        node.smooth ? this.ctx.translate(pos.x, pos.y): this.ctx.translate(Math.floor(pos.x), Math.floor(pos.y))
        if (node.initialRotation) {
            this.ctx.rotate(node.initialRotation)
            this.ctx.translate(node.initialPivotX, 0)
        }
        anchor && this.ctx.translate(anchor.x, anchor.y)
        rotation && this.ctx.rotate(rotation)
        anchor && this.ctx.translate(-anchor.x, -anchor.y)
        pivot && this.ctx.translate(pivot.x, pivot.y)
        scale && this.ctx.scale(scale.x, scale.y)
        switch(type) {
            case types.texregion:
                const { x, y } = node.meta
                this.ctx.drawImage(node.texture.img, x, y, node.w, node.h, 0, 0, node.w, node.h)
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
            // case types.isocube:
            //     this.ctx.fillStyle = node.frontColor
            //     this.ctx.fillRect(0, 0, node.width, node.width)

            //     this.ctx.beginPath()
            //     this.ctx.moveTo(node.width, 0)
            //     this.ctx.lineTo(node.length + node.width, -node.length)
            //     this.ctx.lineTo(node.length + node.width, node.width - node.length)
            //     this.ctx.lineTo(node.width, node.width)
            //     this.ctx.closePath()
            //     this.ctx.fillStyle = node.sideColor
            //     this.ctx.fill()

            //     this.ctx.beginPath()
            //     this.ctx.lineTo(node.length, -node.length)
            //     this.ctx.lineTo(node.length + node.width, -node.length)
            //     this.ctx.lineTo(node.width, 0)
            //     this.ctx.lineTo(0, 0)
            //     this.ctx.fillStyle = node.topColor
            //     this.ctx.fill()
            // break
            // case types.text:
            // break
            // case types.sprite:

            // break
            // case types.circle:
            //     this.ctx.beginPath()
            //     this.ctx.arc(0, 0, node.radius, 0, Math.PI * 2, false)
            //     this.ctx.closePath()
            //     if (node.fill) {
            //         this.ctx.fillStyle = node.fill
            //         this.ctx.fill()
            //     }
            //     if (node.stroke) {
            //         this.ctx.strokeStyle = node.stroke
            //         this.ctx.stroke()
            //     }
            // break
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