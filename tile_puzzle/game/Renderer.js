import { mat4 } from '../lib/gl-matrix-module.js';

import { WebGL } from '../common/engine/WebGL.js';

import { shaders } from './shaders.js';

export class Renderer {

    constructor(gl) {
        this.gl = gl;

        gl.clearColor(1, 1, 1, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        this.programs = WebGL.buildPrograms(gl, shaders);

        this.defaultTexture = WebGL.createTexture(gl, {
            width  : 1,
            height : 1,
            data   : new Uint8Array([255, 255, 255, 255])
        });
    }

    prepare(scene) {
        scene.nodes.forEach(node => {
            node.gl = {};
            if (node.mesh) {
                Object.assign(node.gl, this.createModel(node.mesh, node.type == "tile"));
            }
            if (node.image) {
                node.gl.texture = this.createTexture(node.image);
            }
        });
    }

    render(scene, player, camera) {
        const gl = this.gl;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.disable(gl.SCISSOR_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const program = this.programs.simple;
        gl.useProgram(program.program);

        let matrixPlayer = mat4.create();
        let matrixPlayerStack = [];

        const viewMatrix = player.getGlobalTransform();
        mat4.invert(viewMatrix, viewMatrix);
        mat4.copy(matrixPlayer, viewMatrix);
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, player.projection);

        scene.traverse(
            node => {
                if(node.visible){
                    matrixPlayerStack.push(mat4.clone(matrixPlayer));
                    mat4.mul(matrixPlayer, matrixPlayer, node.transform);
                    if (node.gl.vao) {
                        gl.bindVertexArray(node.gl.vao);
                        gl.uniformMatrix4fv(program.uniforms.uViewModel, false, matrixPlayer);
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, node.gl.texture);
                        gl.uniform1i(program.uniforms.uTexture, 0);
                        gl.drawElements(gl.TRIANGLES, node.gl.indices, gl.UNSIGNED_SHORT, 0);
                    }
                }
            },
            node => {
                if(node.visible)
                    matrixPlayer = matrixPlayerStack.pop();
            }
        );

        // test draw mini map
        const miniMapWidth = 400;
        const miniMapHeight = 400;
        const miniMapX = gl.canvas.width - miniMapWidth;
        const miniMapY = gl.canvas.height - miniMapHeight;
        gl.viewport(miniMapX, miniMapY, miniMapWidth, miniMapHeight);
        gl.scissor(miniMapX, miniMapY, miniMapWidth, miniMapHeight);
        gl.enable(gl.SCISSOR_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program.program);

        let matrixCamera = mat4.create();
        let matrixCameraStack = [];

        const viewMatrix2 = camera.getGlobalTransform();
        mat4.invert(viewMatrix2, viewMatrix2);
        mat4.copy(matrixCamera, viewMatrix2);
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, camera.projection);

        scene.traverse(
            node => {
                matrixCameraStack.push(mat4.clone(matrixCamera));
                mat4.mul(matrixCamera, matrixCamera, node.transform);
                if (node.gl.vao) {
                    gl.bindVertexArray(node.gl.vao);
                    gl.uniformMatrix4fv(program.uniforms.uViewModel, false, matrixCamera);
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, node.gl.texture);
                    gl.uniform1i(program.uniforms.uTexture, 0);
                    gl.drawElements(gl.TRIANGLES, node.gl.indices, gl.UNSIGNED_SHORT, 0);
                }
            },
            node => {
                matrixCamera = matrixCameraStack.pop();
            }
        );
    }

    createModel(model, topOnly) {
        const gl = this.gl;

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        if(topOnly){
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.toponly), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(1);
            gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        }
        else{
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.texcoords), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(1);
            gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

        const indices = model.indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

        return { vao, indices };
    }

    createTexture(texture) {
        const gl = this.gl;
        return WebGL.createTexture(gl, {
            image : texture,
            min   : gl.NEAREST,
            mag   : gl.NEAREST
        });
    }

}
