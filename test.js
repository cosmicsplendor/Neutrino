import config from "@config";
import getContext from "./utils/getContext";
import createShader from "./utils/createShader";
import createProgram from "./utils/createProgram";
import vertexShaderSrc from "./shaders/vertexShader";
import fragShaderSrc from "./shaders/fragmentShader";
import MatrixUtil, { IMatrix } from "./utils/Matrix";
import createMatStackMixin from "./createMatStackMixin";
import { WEBGL } from "../apis";

const createMatStackMixin = () => {
    const mixin = {}
    mixin.mStack = []
    mixin.mStack.push(IMatrix.create()) // identity matrix
    mixin.curMatIdx = 0
    mixin.curMat = mixin.mStack[0]
    mixin.firstMat = mixin.mStack[0]
    mixin.getCurMat = function() {
        return this.curMat
    }
    mixin.save = function() {
        this.curMatIdx += 1
        this.mStack[this.curMatIdx] =  this.mStack[this.curMatIdx] || IMatrix.create()
        this.curMat = this.mStack[this.curMatIdx]
        // copying previous matrix into the current one (can be interpreted as cloning the previous matrix and pushing it into the stack)
        const prev = this.mStack[this.curMatIdx - 1]
        for (let i = 0; i < 9; i++) {
            this.curMat[i] = prev[i]
        }
    }
    mixin.restore = function() {
        if (this.curMatIdx === 0) {
            throw new Error("couldn't restore state: no save point could be found")
        }
        // unwinding the matrix (popping the stack)
        this.curMatIdx -= 1
        this.curMat = this.mStack[this.curMatIdx]
    }
    return mixin
}


class Webgl2Renderer {
    api = WEBGL;
    defBlend = "source-over"; // global blendMode
    defTint = [0, 0, 0, 0]; // default tint

    constructor({ image, cnvQry, viewport, scene, clearColor = [0, 0, 0, 0], background = "#000000" }) {
        this.canvas = document.querySelector(cnvQry);
        this.gl = getContext(cnvQry);
        this.program = this.initProgram();
        this.image = image;
        this.scene = scene;
        this.clearColor = clearColor;
        this.initBuffers();
        this.initUniforms();
        this.matrixUtil = new MatrixUtil();
        this.setupGlSettings();
        this.initViewport(viewport);
        this.changeBackground(background);
        Object.assign(this, createMatStackMixin()); // Must be done before calling resize
        this.resize(viewport);
    }

    initProgram() {
        const gl = this.gl;
        const program = createProgram(
            gl,
            createShader(gl, vertexShaderSrc, gl.VERTEX_SHADER),
            createShader(gl, fragShaderSrc, gl.FRAGMENT_SHADER)
        );
        gl.useProgram(program);
        return program;
    }

    initBuffers() {
        const gl = this.gl;

        // Create and bind VAO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 0,
            1, 1,
            0, 1
        ]), gl.STATIC_DRAW);

        const aVertPos = gl.getAttribLocation(this.program, "vert_pos");
        gl.enableVertexAttribArray(aVertPos);
        gl.vertexAttribPointer(aVertPos, 2, gl.FLOAT, false, 0, 0);

        // Unbind VAO
        gl.bindVertexArray(null);
    }

    initUniforms() {
        const gl = this.gl;
        this.uMat = gl.getUniformLocation(this.program, "mat");
        this.uTexMat = gl.getUniformLocation(this.program, "tex_mat");
        this.uOverlay = gl.getUniformLocation(this.program, "overlay"); // px_mod flag
        this.uOverlayCol = gl.getUniformLocation(this.program, "overlay_col"); // uniform3fv
        this.uTint = gl.getUniformLocation(this.program, "tint"); // current tint (uniform4fv)
        this.uGTint = gl.getUniformLocation(this.program, "g_tint"); // global tint (applies to all sprites)
        this.uAlpha = gl.getUniformLocation(this.program, "alpha");
    }

    setupGlSettings() {
        const gl = this.gl;
        gl.enable(gl.BLEND);
        this.setDefaultSettings();
    }

    setDefaultSettings() {
        this.overlay = false;
        this.alpha = 1;
        this.gTint = this.defTint;
        this.blendMode = this.defBlend;
    }

    initViewport(viewport) {
        viewport.on("change", this.resize.bind(this));
    }

    set clearColor(arr) {
        this.gl.clearColor(...arr);
    }

    set alpha(val) {
        this.gl.uniform1f(this.uAlpha, val);
    }

    set gTint(val) {
        this.gl.uniform4fv(this.uGTint, val);
    }

    set tint(val) {
        this.gl.uniform4fv(this.uTint, val);
    }

    set blendMode(val) {
        const gl = this.gl;
        switch (val) {
            default:
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    set overlay(val) {
        this.gl.uniform1i(this.uOverlay, val ? 1 : 0);
        if (val) {
            this.gl.uniform3fv(this.uOverlayCol, val);
        }
    }

    setTexatlas(image, meta) {
        const gl = this.gl;
        const texture = gl.createTexture();
        const uTexUnit = gl.getUniformLocation(this.program, "tex_unit");
        const texUnit = 0;
        this.meta = meta;
        this.image = image;
        gl.activeTexture(gl.TEXTURE0 + texUnit);
        gl.uniform1i(uTexUnit, texUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    translate(x, y) {
        this.matrixUtil.translate(this.getCurMat(), x, y);
    }

    rotate(rad) {
        this.matrixUtil.rotate(this.getCurMat(), rad);
    }

    scale(x, y) {
        this.matrixUtil.scale(this.getCurMat(), x, y);
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    changeBackground(bgColor) {
        if (!bgColor) { return; }
        this.canvas.style.background = bgColor;
    }

    resize({ width, height }) {
        const absWidth = Math.round(width * config.devicePixelRatio);
        const absHeight = Math.round(height * config.devicePixelRatio);

        this.canvas.setAttribute("width", absWidth);
        this.canvas.setAttribute("height", absHeight);
        this.gl.viewport(0, 0, absWidth, absHeight);

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        this.matrixUtil.identity(this.firstMat);
        this.matrixUtil.scale(this.firstMat, 1, -1);
        this.matrixUtil.translate(this.firstMat, -1, -1);
        this.matrixUtil.scale(this.firstMat, 2 / absWidth, 2 / absHeight);
    }

    render(node) {
        const { rotation, anchor } = node;
        this.translate(Math.round(node.pos.x), Math.round(node.pos.y));
        if (node.initialRotation) {
            this.rotate(node.initialRotation);
            this.translate(node.initialPivotX, 0);
        }
        if (rotation) {
            anchor && this.translate(anchor.x, anchor.y);
            this.rotate(rotation);
            anchor && this.translate(-anchor.x, -anchor.y);
        }
        if (node.scale) {
            this.scale(node.scale.x, node.scale.y);
        }
        if (node.blendMode) {
            this.blendMode = node.blendMode;
        }
        if (!node.frame) {
            return; // if the node isn't renderable, just do transforms
        }

        const meta = this.meta[node.frame];
        const srcX = meta.x;
        const srcY = meta.y;
        const width = node.w;
        const height = node.h;

        this.scale(width, height);

        if (node.texMatFrame !== node.frame) {
            node.texMat = this.matrixUtil.create();
            node.texMatFrame = node.frame;
            this.matrixUtil.translate(node.texMat, srcX / this.image.width, srcY / this.image.height);
            this.matrixUtil.scale(node.texMat, width / this.image.width, height / this.image.height);
        }

        this.gl.uniformMatrix3fv(this.uMat, false, this.getCurMat());
        this.gl.uniformMatrix3fv(this.uTexMat, false, node.texMat);

        // Bind VAO before drawing
        this.gl.bindVertexArray(this.vao);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        this.gl.bindVertexArray(null); // Unbind VAO

        this.scale(1 / width, 1 / height);
    }

    renderRecursively(node = this.scene) {
        if (!node._visible) { return; }
        if (node === this.scene) { this.clear(); }
        this.save();

        this.setAlphaAndBlendMode(node);
        this.render(node);

        if (node.children) {
            for (const child of node.children) {
                this.renderRecursively(child);
            }
        }

        this.resetAlphaAndBlendMode(node);
        this.restore();
    }

    setAlphaAndBlendMode(node) {
        if (node.blendMode) {
            this.blendMode = node.blendMode;
        }
        if (node.alpha) {
            this.alpha = node.alpha;
        }
        if (node.overlay) {
            this.overlay = node.overlay;
        }
        if (node.tint) {
            this.tint = node.tint;
        }
    }

    resetAlphaAndBlendMode(node) {
        if (node.overlay) {
            this.overlay = false;
        }
        if (node.tint) {
            this.tint = this.defTint;
        }
        if (node.alpha) {
            this.alpha = 1;
        }
        if (node.blendMode) {
            this.blendMode = this.defBlend;
        }
    }
}

export default Webgl2Renderer;