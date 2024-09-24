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
        Object.assign(this, createMatStackMixin()); // Must be done before calling resize
        this.resize(viewport);
        this.viewport = viewport
        this.changeBackground(background);
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

        // Instance Tint
        const instanceTintBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceTintBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 0, gl.DYNAMIC_DRAW);

        const aInstanceTint = gl.getAttribLocation(this.program, "instance_tint");
        gl.enableVertexAttribArray(aInstanceTint);
        gl.vertexAttribPointer(aInstanceTint, 4, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(aInstanceTint, 1);

        // Instance Alpha
        const instanceAlphaBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceAlphaBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 0, gl.DYNAMIC_DRAW);

        const aInstanceAlpha = gl.getAttribLocation(this.program, "instance_alpha");
        gl.enableVertexAttribArray(aInstanceAlpha);
        gl.vertexAttribPointer(aInstanceAlpha, 1, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(aInstanceAlpha, 1);

        // Instance Overlay
        const instanceOverlayBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceOverlayBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 0, gl.DYNAMIC_DRAW);

        const aInstanceOverlay = gl.getAttribLocation(this.program, "instance_overlay");
        gl.enableVertexAttribArray(aInstanceOverlay);
        gl.vertexAttribIPointer(aInstanceOverlay, 1, gl.INT, 0, 0);
        gl.vertexAttribDivisor(aInstanceOverlay, 1);

        // Instance Overlay Color
        const instanceOverlayColBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceOverlayColBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, 0, gl.DYNAMIC_DRAW);

        const aInstanceOverlayCol = gl.getAttribLocation(this.program, "instance_overlay_col");
        gl.enableVertexAttribArray(aInstanceOverlayCol);
        gl.vertexAttribPointer(aInstanceOverlayCol, 3, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(aInstanceOverlayCol, 1);

        // Unbind VAO
        gl.bindVertexArray(null);

        // Store instance buffers for later use
        this.instanceBuffers = {
            instanceMatBuffer,
            instanceTexMatBuffer,
            instanceTintBuffer,
            instanceAlphaBuffer,
            instanceOverlayBuffer,
            instanceOverlayColBuffer
        };
    }

    // ... other existing methods ...
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
    renderRecursively(node = this.scene, batches = {}) {
        if (!node._visible) { return; }
        if (node === this.scene) { this.clear(); }

        this.save();

        this.setAlphaAndBlendMode(node);
        this.collectInstanceDataByBatch(node, batches);

        if (node.children) {
            for (const child of node.children) {
                this.renderRecursively(child, batches);
            }
        }

        this.resetAlphaAndBlendMode(node);
        this.restore();

        // After collecting all instance data, render each batch
        for (const [textureKey, batch] of Object.entries(batches)) {
            this.bindTexture(batch.texture);
            this.uploadInstanceData(batch.data);
            this.drawInstances(batch.count);
        }

        // Clear instance data after rendering
        this.clearInstanceData();
    }

    collectInstanceDataByBatch(node, batches) {
        if (!node.frame) {
            return; // If the node isn't renderable, just do transforms
        }

        const { rotation, anchor, scale, pos, alpha, blendMode, tint, overlay, overlay_col, frame, textureKey } = node;

        // Determine the texture atlas key (assuming all use the same atlas for now)
        const key = "main_atlas"; // Replace with actual key if multiple atlases

        if (!batches[key]) {
            batches[key] = { texture: this.image, data: { mat: [], texMat: [], tint: [], alpha: [], overlay: [], overlay_col: [] }, count: 0 };
        }

        const batch = batches[key];

        // Compute transformation matrix for the instance
        let mat = this.matrixUtil.clone(this.getCurMat());

        // Compute texture matrix
        let texMat = this.matrixUtil.create();
        const meta = this.meta[frame];
        const srcX = meta.x;
        const srcY = meta.y;
        const width = node.w;
        const height = node.h;

        this.matrixUtil.translate(texMat, srcX / this.image.width, srcY / this.image.height);
        this.matrixUtil.scale(texMat, width / this.image.width, height / this.image.height);

        // Collect instance data
        batch.data.mat.push(...mat); // Assuming mat is a flat array of 9 elements
        batch.data.texMat.push(...texMat);
        batch.data.tint.push(...(tint || this.defTint));
        batch.data.alpha.push(alpha !== undefined ? alpha : this.alpha);
        batch.data.overlay.push(overlay ? 1 : 0);
        batch.data.overlay_col.push(...(overlay_col || [0, 0, 0]));
        batch.count += 1;
    }

    bindTexture(texture) {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(this.uTexUnit, 0);
    }

    uploadInstanceData(data) {
        const gl = this.gl;

        // Upload Transformation Matrices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffers.instanceMatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.mat), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffers.instanceTexMatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.texMat), gl.DYNAMIC_DRAW);

        // Upload Tint
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffers.instanceTintBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.tint), gl.DYNAMIC_DRAW);

        // Upload Alpha
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffers.instanceAlphaBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.alpha), gl.DYNAMIC_DRAW);

        // Upload Overlay
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffers.instanceOverlayBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Int32Array(data.overlay), gl.DYNAMIC_DRAW);

        // Upload Overlay Color
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffers.instanceOverlayColBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.overlay_col), gl.DYNAMIC_DRAW);
    }

    drawInstances(count) {
        const gl = this.gl;
        gl.bindVertexArray(this.vao);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
        gl.bindVertexArray(null);
    }

    clearInstanceData() {
        this.instanceData = {
            mat: [],
            texMat: [],
            tint: [],
            alpha: [],
            overlay: [],
            overlay_col: []
        };
    }

    renderFrame() {
        // Start a new frame
        const batches = {};

        // Collect instance data by traversing the scene graph
        this.renderRecursively(this.scene, batches);
    }

    // ... rest of the existing methods ...
}


export default Webgl2Renderer