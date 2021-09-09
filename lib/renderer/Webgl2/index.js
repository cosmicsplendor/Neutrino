import getContext from "./utils/getContext"
import createShader from "./utils/createShader"
import createProgram from "./utils/createProgram"
import vertexShaderSrc from "./shaders/vertexShader"
import fragShaderSrc from "./shaders/fragmentShader"
import MatrixUtil from "./utils/Matrix"
import StateStack from "./utils/StateStack"

class Webgl2Renderer {
    constructor({ image, cnvQry="#viewport", viewport, scene, clearColor=[ 0, 0, 0, 0 ], background = "#000000" }) {
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
        
        this.uResLocation = gl.getUniformLocation(program, "u_resolution")
        this.uMatLocation = gl.getUniformLocation(program, "u_matrix")
        this.uTexMatLocation = gl.getUniformLocation(program, "u_tex_matrix")
        this.matrixUtil = new MatrixUtil()
        this.uTexMatrix = this.matrixUtil.create() // identity matrix
        
        // position attributes initialization tasks
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
        this.setTexture(image)
        this.blendMode = "source-over"
        this.resize(viewport)
        this.clearColor = clearColor
        this.stateStack = new StateStack()
        this.scene = scene
        this.changeBackground(background)
        // viewport.on("change", this.resize.bind(this))
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
    setTexture(image) {
        // texture states setup
        const { gl, program } = this
        const texture = gl.createTexture()
        const uTexUnitLocation = gl.getUniformLocation(program, "u_tex_unit")
        const texUnit = 0
        gl.useProgram(program)
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
        this.canvas.width = width
        this.canvas.height = height
        this.gl.viewport(0, 0, width, height)
        this.gl.uniform2f(this.uResLocation, width, height)
    }
    render(node) {
        const { rotation, anchor } = node
        if (!node.meta) { // if the node isn't renderable, just do transforms
            if (rotation) {
                anchor && this.translate(-anchor.x, -anchor.y)
                this.rotate(rotation)
                anchor && this.translate(anchor.x, anchor.y)
            }
            this.translate(node.pos.x, node.pos.y)
            return
        }
        const srcX = node.meta.x
        const srcY = node.meta.y
        const width = node.w
        const height = node.h
        const initialRotation = node.initialRotation
        const initialPivotX = node.initialPivotX


        const { matrixUtil, uTexMatrix, uMatLocation, uTexMatLocation, image, gl } = this
        this.save()

        this.scale(width, height)
        if (node.initialRotation) {
            this.rotate(initialRotation)
            this.translate(initialPivotX, 0)
        }
        if (rotation) {
            anchor && this.translate(-anchor.x, -anchor.y)
            this.rotate(rotation)
            anchor && this.translate(anchor.x, anchor.y)
        }
        this.translate(node.pos.x, node.pos.y)

        matrixUtil.identity(uTexMatrix)
        matrixUtil.scale(uTexMatrix, width / image.width, height / image.height)
        matrixUtil.translate(uTexMatrix, srcX / image.width, srcY / image.height)

        gl.uniformMatrix3fv(uMatLocation, false, this.stateStack.active.mat)
        gl.uniformMatrix3fv(uTexMatLocation, false, uTexMatrix)
        gl.drawArrays(gl.TRIANGLES, 0, 6)

        this.restore()
    }
    renderRec(node=this.scene) {
        if (!node._visible) { return }
        if (node === this.scene) { this.clear() }

        this.save()
        // if (node.alpha) {
        //     this.stateStack.active.alpha = node.alpha
        // }
        // if (node.blendMode) {
        //     this.stateStack.active.blendMode = node.blendMode
        // }
        this.render(node)
        if (node.children) {
            for (let i = 0, len = node.children.length; i < len; i++) {
                this.renderRecursively(node.children[i])
            }
        }
        this.restore()
    }
}

export default Webgl2Renderer