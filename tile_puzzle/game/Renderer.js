import { mat4,vec3 } from '../lib/gl-matrix-module.js';

import { WebGL } from '../common/engine/WebGL.js';

import { shaders } from './shaders.js';

export class Renderer {

    constructor(gl) {
        this.gl = gl;

        gl.clearColor(0.2, 0.2, 0.8, 0.8);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        this.programs = WebGL.buildPrograms(gl, shaders);
        this.programs1 = WebGL.buildPrograms(gl, shaders);

    }

    prepare(scene) {
        scene.nodes.forEach(node => {
            node.gl = {};
            if (node.mesh) {
                Object.assign(node.gl, this.createModel(node.mesh, (node.type === "tile" || node.type === "grid_piece")));
            }
            if (node.image) {
                node.gl.texture = this.createTexture(node.image);
            }
        });
    }

    render(scene, player, camera, light) {
        const gl = this.gl

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.disable(gl.SCISSOR_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const program = this.programs.simple;
        const program1 = this.programs1.simple;
        gl.useProgram(program.program);

        let matrixPlayer = mat4.create();
        let matrixPlayerStack = [];

        const viewMatrix = player.getGlobalTransform();
        mat4.invert(viewMatrix, viewMatrix);
        mat4.copy(matrixPlayer, viewMatrix);
        gl.uniformMatrix4fv(program.uniforms.uProjection, false, player.projection);


        let color = vec3.clone(light.ambientColor);
        vec3.scale(color, color, 1.0 / 255.0);
        gl.uniform3fv(program.uniforms.uAmbientColor, color);
        color = vec3.clone(light.diffuseColor);
        vec3.scale(color, color, 1.0 / 255.0);
        gl.uniform3fv(program.uniforms.uDiffuseColor, color);
        color = vec3.clone(light.specularColor);
        vec3.scale(color, color, 1.0 / 255.0);
        gl.uniform3fv(program.uniforms.uSpecularColor, color);
        gl.uniform1f(program.uniforms.uShininess, light.shininess);
        gl.uniform3fv(program.uniforms.uLightPosition, light.position);
        gl.uniform3fv(program.uniforms.uLightAttenuation, light.attenuatuion);


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

        if(isMinimapDisplayed){
            if((StartTime - Date.now()) <= 0 || timeLeft <= 0){
                isMinimapDisplayed = !isMinimapDisplayed;
                timeLeft = 0;
                timeM.innerHTML = "time's up : 0s";    
            } else{
                timeM.innerHTML = "Minimap time left: " + (Math.ceil((StartTime - Date.now()) / 1000)).toString() + "s";
            }
            
            // test draw mini map
            console.log("displayed");
            const miniMapWidth = gl.canvas.height/2;
            const miniMapHeight = gl.canvas.height/2;
            const miniMapX = gl.canvas.width - miniMapWidth;
            const miniMapY = gl.canvas.height - miniMapHeight;
            gl.viewport(miniMapX, miniMapY, miniMapWidth, miniMapHeight);
            gl.scissor(miniMapX, miniMapY, miniMapWidth, miniMapHeight);
            gl.enable(gl.SCISSOR_TEST);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.useProgram(program1.program);

            let matrixCamera = mat4.create();
            let matrixCameraStack = [];

            const viewMatrix2 = camera.getGlobalTransform();
            mat4.invert(viewMatrix2, viewMatrix2);
            mat4.copy(matrixCamera, viewMatrix2);
            gl.uniformMatrix4fv(program1.uniforms.uProjection, false, camera.projection);

            let color1 = vec3.clone(light.ambientColor);
            vec3.scale(color1, color1, 4.0 / 255.0);
            gl.uniform3fv(program1.uniforms.uAmbientColor, color1);
            color1 = vec3.clone(light.diffuseColor);
            vec3.scale(color1, color1, 1.0 / 255.0);
            gl.uniform3fv(program1.uniforms.uDiffuseColor, color1);
            color1 = vec3.clone(light.specularColor);
            vec3.scale(color1, color1, 1.0 / 255.0);
            gl.uniform3fv(program1.uniforms.uSpecularColor, color1);
            gl.uniform1f(program1.uniforms.uShininess, light.shininess);
            gl.uniform3fv(program1.uniforms.uLightPosition, light.position);
            gl.uniform3fv(program1.uniforms.uLightAttenuation, light.attenuatuion);


            scene.traverse(
                node => {
                    matrixCameraStack.push(mat4.clone(matrixCamera));
                    mat4.mul(matrixCamera, matrixCamera, node.transform);
                    if (node.gl.vao) {
                        gl.bindVertexArray(node.gl.vao);
                        gl.uniformMatrix4fv(program1.uniforms.uViewModel, false, matrixCamera);
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, node.gl.texture);
                        gl.uniform1i(program1.uniforms.uTexture, 0);
                        gl.drawElements(gl.TRIANGLES, node.gl.indices, gl.UNSIGNED_SHORT, 0);
                    }
                },
                () => {
                    matrixCamera = matrixCameraStack.pop();
                }
            );
        }

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

let isMinimapDisplayed = false;
let timeStarted = false;

let  timeM = document.getElementById("time2");

let StartTime;
let timeLeft = 60000; // 1min = 60000;

document.addEventListener("keypress", e => {
    let code = e.keyCode || e.which;
    let pressedChar = String.fromCharCode(code).toLowerCase();
    switch (pressedChar) {
        case'm':
            if(timeLeft > 0){
                isMinimapDisplayed = !isMinimapDisplayed;
                if(!isMinimapDisplayed){
                    timeLeft = StartTime - Date.now();
                    console.log(timeLeft);
                }
                StartTime = Date.now() + timeLeft;
            }
            break;
    }
});

