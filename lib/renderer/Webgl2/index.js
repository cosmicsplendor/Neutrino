import config from "@config";
import getContext from "./utils/getContext";
import createShader from "./utils/createShader";
import createProgram from "./utils/createProgram";
import vertexShaderSrc from "./shaders/vertexShader";
import fragShaderSrc from "./shaders/fragmentShader";
import MatrixUtil, { IMatrix } from "./utils/Matrix";
import createMatStackMixin from "./createMatStackMixin";
import { WEBGL } from "../apis";

class Webgl2Renderer {
    api = WEBGL
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
        // this.setupGlSettings();
        this.initViewport(viewport);
        Object.assign(this, createMatStackMixin()); // Must be done before calling resize
        this.resize(viewport);
        this.viewport = viewport
        this.changeBackground(background);
    }
    texMatCache = {}
    instanceData = {
        mat: [],
        texMat: [],
        alpha: [],
        count: 0
    }
    set clearColor(arr) {
        this.gl.clearColor(...arr);
    }
    initViewport(viewport) {
        viewport.on("change", this.resize.bind(this));
    }
    changeBackground(bgColor, imageUrl) {
        this.canvas.setAttribute("style", `background-image:url(${imageUrl}); background-color: ${bgColor} !important; width: ${config.viewport.width}px; height: ${config.viewport.height};`)
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
    initUniforms() {
        const gl = this.gl;
        this.uMat = gl.getUniformLocation(this.program, "mat");
        this.gMat = IMatrix.create()
        this.gl.uniformMatrix3fv(this.uMat, false, this.gMat)
    }
    initBuffers() {
        const gl = this.gl;

        // Create and bind VAO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        // Vertex Positions
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

        // Instance Transformation Matrices
        const instanceMatBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceMatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 0, gl.DYNAMIC_DRAW);

        const aInstanceMat = [
            gl.getAttribLocation(this.program, "instance_mat"),
            gl.getAttribLocation(this.program, "instance_mat") + 1,
            gl.getAttribLocation(this.program, "instance_mat") + 2
        ];

        const matSize = 3; // 3x3 matrix

        for (let i = 0; i < matSize; i++) {
            gl.enableVertexAttribArray(aInstanceMat[i]);
            gl.vertexAttribPointer(aInstanceMat[i], 3, gl.FLOAT, false, 9 * 4, i * 3 * 4);
            gl.vertexAttribDivisor(aInstanceMat[i], 1); // Advance per instance
        }

        // Instance Texture Matrices
        const instanceTexMatBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceTexMatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 0, gl.DYNAMIC_DRAW);

        const aInstanceTexMat = [
            gl.getAttribLocation(this.program, "instance_tex_mat"),
            gl.getAttribLocation(this.program, "instance_tex_mat") + 1,
            gl.getAttribLocation(this.program, "instance_tex_mat") + 2
        ];

        for (let i = 0; i < matSize; i++) {
            gl.enableVertexAttribArray(aInstanceTexMat[i]);
            gl.vertexAttribPointer(aInstanceTexMat[i], 3, gl.FLOAT, false, 9 * 4, i * 3 * 4);
            gl.vertexAttribDivisor(aInstanceTexMat[i], 1);
        }

        // Instance Alpha
        const instanceAlphaBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceAlphaBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 0, gl.DYNAMIC_DRAW);

        const aInstanceAlpha = gl.getAttribLocation(this.program, "instance_alpha");
        gl.enableVertexAttribArray(aInstanceAlpha);
        gl.vertexAttribPointer(aInstanceAlpha, 1, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(aInstanceAlpha, 1);

        // Unbind VAO
        gl.bindVertexArray(null);

        // Store instance buffers for later use
        this.instanceBuffers = {
            instanceMatBuffer,
            instanceTexMatBuffer,
            instanceAlphaBuffer
        };
    }

    // ... other existing methods ...
    renderRecursively(node = this.scene, batches = {}) {
        if (!node._visible) { return; }
        if (node === this.scene) this.clear()

        this.save();

        this.collectInstanceData(node, batches);

        if (node.children) {
            for (const child of node.children) {
                this.renderRecursively(child, batches);
            }
        }

        this.restore();

        if (node !== this.scene) return
        // After collecting all instance data, render each batch
        this.uploadInstanceData();
        this.drawInstances(this.instanceData.count);
        // Clear instance data after rendering
        this.clearInstanceData();
    }

    collectInstanceData(node) {
        this.translate(Math.round(node.pos.x), Math.round(node.pos.y));
        if (node.initialRotation) {
            this.rotate(node.initialRotation);
            this.translate(node.initialPivotX, 0);
        }
        if (node.rotation) {
            node.anchor && this.translate(node.anchor.x, node.anchor.y);
            this.rotate(node.rotation);
            node.anchor && this.translate(-node.anchor.x, -node.anchor.y);
        }
        if (node.scale) {
            this.scale(node.scale.x, node.scale.y);
        }
        if (!node.frame) {
            return; // if the node isn't renderable, just do transforms
        }

        // Compute texture matrix
        if (!this.texMatCache[node.frame]) {
            const texMat = this.matrixUtil.create();
            const meta = this.meta[node.frame];
            const srcX = meta.x;
            const srcY = meta.y;
            const width = node.w;
            const height = node.h;
    
            this.matrixUtil.translate(texMat, srcX / this.image.width, srcY / this.image.height);
            this.matrixUtil.scale(texMat, width / this.image.width, height / this.image.height);

            this.texMatCache[node.frame] = texMat
        }

        // Collect instance data
        this.instanceData.mat.push(...this.getCurMat()); // Assuming mat is a flat array of 9 elements
        this.instanceData.texMat.push(...this.texMatCache[node.frame]);
        this.instanceData.alpha.push(node.alpha !== undefined ? node.alpha : 1);
        this.instanceData.count += 1;
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
    uploadInstanceData() {
        const gl = this.gl;

        // Upload Transformation Matrices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffers.instanceMatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.instanceData.mat), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffers.instanceTexMatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.instanceData.texMat), gl.DYNAMIC_DRAW);

        // Upload Alpha
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffers.instanceAlphaBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.instanceData.alpha), gl.DYNAMIC_DRAW);
    }
    drawInstances(count) {
        const gl = this.gl;
        gl.bindVertexArray(this.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
        gl.bindVertexArray(null);
    }
    clearInstanceData() {
        const { mat, texMat, alpha } = this.instanceData
        mat.length = 0
        texMat.length = 0
        alpha.length = 0
        this.instanceData.count = 0
    }
}


export default Webgl2Renderer