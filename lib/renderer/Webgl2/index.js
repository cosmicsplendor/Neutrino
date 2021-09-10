import getContext from "./utils/getContext"
import createShader from "./utils/createShader"
import createProgram from "./utils/createProgram"
import vertexShaderSrc from "./shaders/vertexShader"
import fragShaderSrc from "./shaders/fragmentShader"
import MatrixUtil from "./utils/Matrix"
import StateStack from "./utils/StateStack"

class Webgl2Renderer {
    _pxMod = false
    _tint = false
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
        const aVertPosLocation = gl.getAttribLocation(program, "a_vert_pos")
        const posBuffer = gl.createBuffer()
        // const vao = gl.createVertexArray()
        
        this.uResLocation = gl.getUniformLocation(program, "u_resolution")
        this.uMatLocation = gl.getUniformLocation(program, "u_matrix")
        this.uTexMatLocation = gl.getUniformLocation(program, "u_tex_matrix")
        this.uPxModLocation = gl.getUniformLocation(program, "u_px_mod") // px_mod flag
        this.uTintLocation = gl.getUniformLocation(program, "u_tint") // tint flat
        this.uPxColLocation = gl.getUniformLocation(program, "u_px_col") // uniform3fv
        this.uTintColLocation = gl.getUniformLocation(program, "u_tint_col") // uniform4fv
        this.matrixUtil = new MatrixUtil()
        this.uTexMatrix = this.matrixUtil.create() // identity matrix
        
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
        gl.enableVertexAttribArray(aVertPosLocation)
        gl.vertexAttribPointer(aVertPosLocation, 2, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        
        // misc setups
        gl.useProgram(program)
        this.blendMode = "source-over"
        this.pxMod = false
        this.clearColor = clearColor
        this.stateStack = new StateStack()
        this.scene = scene
        this.changeBackground(background)
        viewport.on("change", this.resize.bind(this))
        this.resize(viewport)
    }
    set clearColor(arr) {
        this.gl.clearColor(...arr)
    }
    set blendMode(val) {
        switch(val) {
            default:
                this.gl.enable(this.gl.BLEND)
                this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
        }
    }
    set pxMod(val) {
        if (this._pxMod === val) { // skip if pxMod state hasn't changed from last time
            return
        }
        this._pxMod = val
        this.gl.uniform1i(this.uPxModLocation, val ? 1: 0)
    }
    set tint(val) {
        if (this._tint === val) { // if tint state hasn't changed, avoid the overhead of sending data to GPU
            return
        }
        this._tint = val
        this.gl.uniform1i(this.uTintLocation, val ? 1: 0)
    }
    set pxCol(pxCol) {
        this.gl.uniform3fv(this.uPxColLocation, pxCol)
    }
    set tintCol(tintCol) {
        this.gl.uniform4fv(this.uTintColLocation, tintCol)
    }
    setTexatlas(image, meta) {
        // texture states setup
        const { gl, program } = this
        const texture = gl.createTexture()
        const uTexUnitLocation = gl.getUniformLocation(program, "u_tex_unit")
        const texUnit = 0
        this.meta = meta
        this.image = image
        gl.activeTexture(gl.TEXTURE0 + texUnit)
        gl.uniform1i(uTexUnitLocation, texUnit)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.generateMipmap(gl.TEXTURE_2D)
    }
    translate(x, y) {
        this.matrixUtil.translate(this.stateStack.active.mat, x, y)
    }
    rotate(rad) {
        this.matrixUtil.rotate(this.stateStack.active.mat, rad)
    }
    scale(x, y) {
        this.matrixUtil.scale(this.stateStack.active.mat, x, y)
    }
    save() {
        this.stateStack.save()
    }
    restore() {
        this.stateStack.restore()
    }
    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }
    changeBackground(bgColor) {
        this.canvas.style.background = bgColor
    }
    resize({ width, height }) {
        const absWidth = Math.round(width * window.devicePixelRatio)
        const absHeight =  Math.round(height * window.devicePixelRatio)

        this.canvas.setAttribute("width", absWidth)
        this.canvas.setAttribute("height", absHeight)
        this.gl.viewport(0, 0, absWidth, absHeight)
        // this.gl.uniform2f(this.uResLocation, absWidth, absHeight)

        this.canvas.style.width = `${width}px`
        this.canvas.style.height = `${height}px`

        this.matrixUtil.identity(this.stateStack.first.mat)
        // gl_Position = vec4(clipspace * vec2(1, -1), 0, 1);
        this.matrixUtil.scale(this.stateStack.first.mat, 1, -1)
        // vec2 clipspace = (normalized * 2.0) - 1.0;
        this.matrixUtil.translate(this.stateStack.first.mat, -1, -1)
        // vec2 normalized = pos_vec / u_resolution;
        this.matrixUtil.scale(this.stateStack.first.mat, 2 / absWidth, 2 / absHeight)
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
        if (!node.frame) { // if the node isn't renderable, just do transforms
            return
        }
        const meta = this.meta[node.frame]
        const srcX = meta.x
        const srcY = meta.y
        const width = node.w
        const height = node.h
        
        const { matrixUtil, uTexMatrix, uMatLocation, uTexMatLocation, image, gl } = this
        
        this.scale(width, height)

        matrixUtil.identity(uTexMatrix)
        matrixUtil.translate(uTexMatrix, srcX / image.width, srcY / image.height)
        matrixUtil.scale(uTexMatrix, width / image.width, height / image.height)

        gl.uniformMatrix3fv(uMatLocation, false, this.stateStack.active.mat)
        gl.uniformMatrix3fv(uTexMatLocation, false, uTexMatrix)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    renderRecursively(node=this.scene) {
        if (!node._visible) { return }
        if (node === this.scene) { this.clear() }
        this.save()
        // if (node.alpha) {
        //     this.stateStack.active.alpha = node.alpha
        // }
        // if (node.blendMode) {
        //     this.stateStack.active.blendMode = node.blendMode
        // }
        if (node.pxCol) {
            this.pxMod = true
            this.pxCol = node.pxCol
        }
        if (node.tint) {
            this.tint = true
            this.tintCol = node.tint
        }

        this.render(node)
        if (node.children) {
            for (let i = 0, len = node.children.length; i < len; i++) {
                this.renderRecursively(node.children[i])
            }
        }

        if (node.pxCol) {
            this.pxMod = false
        }
        if (node.tint) {
            this.tint = false
        }
        this.restore()
    }
}

export default Webgl2Renderer