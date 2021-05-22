import * as types from "@lib/entities/types"
import { getHitbox } from "@lib/utils/entity"
import Rect from "@lib/entities/Rect"
import { aabb } from "@utils/math"

class Canvas2DRenderer {
    constructor({ canvasID, scene, width=500, height=400, background="#fff" }) {
        const canvas = document.querySelector(`#${canvasID}`)
        canvas.setAttribute("width", width)
        canvas.setAttribute("height", height)
        canvas.style.background = background

        this.canvas = canvas
        this.scene = scene
        this.ctx = canvas.getContext("2d")
    }
    render(node) {
        const { type, pos, rotation, scale, pivot, anchor, initialRotation, invisible } = node

        if (invisible) {
            return
        }
        
        this.ctx.translate(~~pos.x, ~~pos.y)
        initialRotation && this.ctx.rotate(Math.PI * initialRotation / 180)
        pivot && this.ctx.translate(pivot.x, pivot.y)
        anchor && this.ctx.translate(anchor.x, anchor.y)
        rotation && this.ctx.rotate(Math.PI * rotation / 180)
        anchor && this.ctx.translate(-anchor.x, -anchor.y)
        pivot && this.ctx.translate(pivot.x, pivot.y)
        scale && this.ctx.scale(scale.x, scale.y)
        
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
            case types.isocube:
                this.ctx.fillStyle = node.frontColor
                this.ctx.fillRect(0, 0, node.width, node.width)

                this.ctx.beginPath()
                this.ctx.moveTo(node.width, 0)
                this.ctx.lineTo(node.length + node.width, -node.length)
                this.ctx.lineTo(node.length + node.width, node.width - node.length)
                this.ctx.lineTo(node.width, node.width)
                this.ctx.closePath()
                this.ctx.fillStyle = node.sideColor
                this.ctx.fill()

                this.ctx.beginPath()
                this.ctx.lineTo(node.length, -node.length)
                this.ctx.lineTo(node.length + node.width, -node.length)
                this.ctx.lineTo(node.width, 0)
                this.ctx.lineTo(0, 0)
                this.ctx.closePath()
                this.ctx.fillStyle = node.topColor
                this.ctx.fill()
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
            case types.circle:
                this.ctx.beginPath()
                this.ctx.arc(0, 0, node.radius, 0, Math.PI * 2, false)
                this.ctx.closePath()
                if (node.fill) {
                    this.ctx.fillStyle = node.fill
                    this.ctx.fill()
                }
                if (node.stroke) {
                    this.ctx.strokeStyle = node.stroke
                    this.ctx.stroke()
                }
            break
        }
    }
    renderRecursively(node) {
        node = node || this.scene

        // if (!this.scene.intersects(node)) {
        //     return
        // }

        node === this.scene && this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        if (!!node.invisible) {
            return
        }

        this.ctx.save()
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