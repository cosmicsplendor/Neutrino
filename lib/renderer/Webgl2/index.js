import config from "@config"
import getContext from "./utils/getContext"
import createShader from "./utils/createShader"
import createProgram from "./utils/createProgram"
import vertexShaderSrc from "./shaders/vertexShader"
import fragShaderSrc from "./shaders/fragmentShader"
import MatrixUtil from "./utils/Matrix"
import createMatStackMixin from "./createMatStackMixin"
import { WEBGL } from "../apis"

class Webgl2Renderer {
    api = WEBGL
    defBlend = "source-over" // global blendMode
    defTint = [ 0, 0, 0, 0 ] // default tint
    constructor({ image, cnvQry, viewport, scene, clearColor=[ 0, 0, 0, 0 ], background = "#000000" }) {
        const gl = getContext(cnvQry)
        const program = createProgram(
            gl,
            createShader(gl, vertexShaderSrc, gl.VERTEX_SHADER),
            createShader(gl, fragShaderSrc, gl.FRAGMENT_SHADER)
        )
        this.canvas = document.querySelector(cnvQry)
        this.image = image
        this.gl = gl
        this.program = program

        // webgl uniforms, attributes and buffers
        const aVertPos = gl.getAttribLocation(program, "vert_pos")
        const posBuffer = gl.createBuffer()
        // const vao = gl.createVertexArray()
        
        this.uMat = gl.getUniformLocation(program, "mat")
        this.uTexMat = gl.getUniformLocation(program, "tex_mat")
        this.uOverlay = gl.getUniformLocation(program, "overlay") // px_mod flag
        this.uOverlayCol = gl.getUniformLocation(program, "overlay_col") // uniform3fv
        this.uTint = gl.getUniformLocation(program, "tint") // current tint (uniform4fv)
        this.uGTint = gl.getUniformLocation(program, "g_tint") // global tint (applies to all sprites)
        this.uAlpha = gl.getUniformLocation(program, "alpha")
        this.matrixUtil = new MatrixUtil()
        // this.texMat = this.matrixUtil.create() // identity matrix

        // position attributes initialization tasks
        // gl.bindVertexArray(vao)

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 0,
            1, 1,
            0, 1
        ]), gl.STATIC_DRAW)
        gl.enableVertexAttribArray(aVertPos)
        gl.vertexAttribPointer(aVertPos, 2, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        
        // misc setups
        gl.useProgram(program)
        this.gl.enable(this.gl.BLEND)
        this.overlay = false // turning off overlay initially
        this.alpha = 1 // global alpha (via setter)
        this.gTint = this.defTint // global tint
        this.blendMode = this.defBlend // initial blendMode
        this.overlay = false
        this.clearColor = clearColor
        this.scene = scene
        this.changeBackground(background)
        viewport.on("change", this.resize.bind(this))
        Object.assign(this, createMatStackMixin()) // order of execution matters here; this line must precede the next one
        this.resize(viewport)
    }
    set clearColor(arr) {
        this.gl.clearColor(...arr)
    }
    set alpha(val) {
        this.gl.uniform1f(this.uAlpha, val)
    }
    set gTint(val) {
        this.gl.uniform4fv(this.uGTint, val)
    }
    set tint(val) {
        this.gl.uniform4fv(this.uTint, val)
    }
    set blendMode(val) {
        switch(val) {
            default:
                this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
        }
    }
    set overlay(val) {
        this.gl.uniform1i(this.uOverlay, val ? 1: 0)
        val && this.gl.uniform3fv(this.uOverlayCol, val)
    }
    setTexatlas(image, meta) {
        // texture states setup
        const { gl, program } = this
        const texture = gl.createTexture()
        const uTexUnit = gl.getUniformLocation(program, "tex_unit")
        const texUnit = 0
        this.meta = meta
        this.image = image
        gl.activeTexture(gl.TEXTURE0 + texUnit)
        gl.uniform1i(uTexUnit, texUnit)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.generateMipmap(gl.TEXTURE_2D)
    }
    translate(x, y) {
        this.matrixUtil.translate(this.getCurMat(), x, y)
    }
    rotate(rad) {
        this.matrixUtil.rotate(this.getCurMat(), rad)
    }
    scale(x, y) {
        this.matrixUtil.scale(this.getCurMat(), x, y)
    }
    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }
    changeBackground(bgColor) {
        if (!bgColor) { return }
        this.canvas.style.background = bgColor
    }
    resize({ width, height }) {
        const absWidth = Math.round(width * config.devicePixelRatio)
        const absHeight =  Math.round(height * config.devicePixelRatio)

        this.canvas.setAttribute("width", absWidth)
        this.canvas.setAttribute("height", absHeight)
        this.gl.viewport(0, 0, absWidth, absHeight)

        this.canvas.style.width = `${width}px`
        this.canvas.style.height = `${height}px`

        this.matrixUtil.identity(this.firstMat)
        // gl_Position = vec4(clipspace * vec2(1, -1), 0, 1);
        this.matrixUtil.scale(this.firstMat, 1, -1)
        // vec2 clipspace = (normalized * 2.0) - 1.0;
        this.matrixUtil.translate(this.firstMat, -1, -1)
        // vec2 normalized = pos_vec / u_resolution;
        this.matrixUtil.scale(this.firstMat, 2 / absWidth, 2 / absHeight)
    }
    render(node) {
        const { rotation, anchor } = node
        this.translate(Math.round(node.pos.x), Math.round(node.pos.y))
        if (node.initialRotation) {
            this.rotate(node.initialRotation)
            this.translate(node.initialPivotX, 0)
        }
        if (rotation) {
            anchor && this.translate(anchor.x, anchor.y)
            this.rotate(rotation)
            anchor && this.translate(-anchor.x, -anchor.y)
        }
        if (node.scale) {
            this.scale(node.scale.x, node.scale.y)
        }
        if (node.blendMode) {

        }
        if (!node.frame) { // if the node isn't renderable, just do transforms
            return
        }
        // const isCustom = Array.isArray(node.frame)
        // const meta = this.meta[node.frame]
        // const srcX = isCustom ? node.frame[0]: meta.x
        // const srcY = isCustom ? node.frame[1]: meta.y
        // const width = isCustom ? node.frame[2]: node.w
        // const height = isCustom ? node.frame[3]: node.h
        
        const meta = this.meta[node.frame]
        const srcX = meta.x
        const srcY = meta.y
        const width = node.w
        const height = node.h
        
        const { matrixUtil, uMat, uTexMat, image, gl } = this
        
        this.scale(width, height)

        // matrixUtil.identity(texMat)
        // matrixUtil.translate(matrixUtil.create(), srcX / image.width, srcY / image.height)
        // matrixUtil.scale(texMat, width / image.width, height / image.height)

        if (node.texMatFrame !== node.frame) {
            node.texMat = matrixUtil.create()
            node.texMatFrame = node.frame
            matrixUtil.translate(node.texMat, srcX / image.width, srcY / image.height)
            matrixUtil.scale(node.texMat, width / image.width, height / image.height)
        }

        gl.uniformMatrix3fv(uMat, false, this.getCurMat())
        gl.uniformMatrix3fv(uTexMat, false, node.texMat)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        this.scale(1 / width, 1 / height)
    }
    renderRecursively(node=this.scene) {
        if (!node._visible) { return }
        if (node === this.scene) { this.clear() }
        this.save()
        /**
         * caveat: set alpha on parent node, only if you expect it to effect all the children
         * if the children don't all have same alpha, assign them their alpha values separately
         * the same applies for "blendMode", "overlay" and "tint" as well
         * 
         * so it's either have these attributes applied to leaf nodes individually
         * or have a shared parent node all of whose decendents possess the same attribute and apply it just once to the parent
         */
        if (node.blendMode) {
            this.blendMode = node.blendMode
        }
        if (node.alpha) {
            this.alpha = node.alpha
        }
        if (node.overlay) {
            this.overlay = node.overlay
        }
        if (node.tint) {
            this.tint = node.tint
        }

        this.render(node)
        if (node.children) {
            for (let i = 0, len = node.children.length; i < len; i++) {
                this.renderRecursively(node.children[i])
            }
        }

        if (node.overlay) {
            this.overlay = false // disabling the overlay
        }
        if (node.tint) {
            this.tint = this.defTint // resetting to default tint
        }
        if (node.alpha) { 
            this.alpha = 1 // resetting active alpha to global alpha
        }
        if (node.blendMode) {
            this.blendMode = this.defBlend // resetting active blendMode to global blendMode
        }
        this.restore()
    }
}

export default Webgl2Renderer