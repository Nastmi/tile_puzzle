import { vec3, mat4 } from '../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';

export class Camera extends Node {

    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.projection = mat4.create();
        this.updateProjection();
        this.farPoint = this.translation.slice();
    }

    updateProjection() {
        mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
    }

    getFarPoint(){
        return this.farPoint;
    }
}

Camera.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 3,
    friction         : 0.2,
    acceleration     : 20
};
