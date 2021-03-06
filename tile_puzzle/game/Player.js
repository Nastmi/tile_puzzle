import { vec3, mat4 } from '../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';

export class Player extends Node {

    constructor(options, playerModel) {
        super(options);
        this.disabled = true;
        Utils.init(this, this.constructor.defaults, options);
        this.projection = mat4.create();
        this.updateProjection();
        this.mousemoveHandler = this.mousemoveHandler.bind(this);
        //farPoint defines how far a tile can be for it to be interactable. It is always placed the same distance away from the player.
        this.farPoint = this.translation.slice();
        this.playerModel = playerModel;
    }

    updateProjection() {
        mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
    }

    update(dt) {
        const c = this;

        const forward = vec3.set(vec3.create(),
            -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));
        const right = vec3.set(vec3.create(),
            Math.cos(c.rotation[1]), 0, -Math.sin(c.rotation[1]));

        // 1: add movement acceleration
        if(!this.disabled){
            let acc = vec3.create();
            if (globalThis.heldKeys['KeyW']) {
                vec3.add(acc, acc, forward);
            }
            if (globalThis.heldKeys['KeyS']) {
                vec3.sub(acc, acc, forward);
            }
            if (globalThis.heldKeys['KeyD']) {
                vec3.add(acc, acc, right);
            }
            if (globalThis.heldKeys['KeyA']) {
                vec3.sub(acc, acc, right);
            }
            vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);
        }

        // 2: update velocity

        // 3: if no movement, apply friction
        if (!globalThis.heldKeys['KeyW'] &&
            !globalThis.heldKeys['heldKeys'] &&
            !globalThis.heldKeys['KeyD'] &&
            !globalThis.heldKeys['KeyA'])
        {
            vec3.scale(c.velocity, c.velocity, 1 - c.friction);
        }

        // 4: limit speed
        const len = vec3.len(c.velocity);
        if (len > c.maxSpeed) {
            vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
        }
        //Update the farPoint. First get forward vector, to find out where the player is facing.
        let x = this.transform[8];
        let y = this.transform[9];
        let z = this.transform[10];
        let vec = new vec3.fromValues(x, y, z);
        //Scale the vector by the distance.
        vec3.scale(vec, vec, -4);
        //Add the players location to the vector, to get the new farPoint.
        vec3.add(vec, vec, this.translation)
        this.farPoint = vec;
        this.farPoint;

        //Move player model
        this.playerModel.translation = this.translation.slice();
        this.playerModel.rotation = this.rotation.slice();
        this.playerModel.rotation[0] = 0;
        this.playerModel.updateTransform();
        return [x, y, z];
    }

    getFarPoint(){
        return this.farPoint;
    }

    enable() {
        document.addEventListener('mousemove', this.mousemoveHandler);
        this.disabled = false;
    }

    disable() {
        document.removeEventListener('mousemove', this.mousemoveHandler);
        this.disabled = true;
    }

    mousemoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;
        const c = this;

        c.rotation[0] -= dy * c.mouseSensitivity;
        c.rotation[1] -= dx * c.mouseSensitivity;

        const pi = Math.PI;
        const twopi = pi * 2;
        const halfpi = pi / 2;

        if (c.rotation[0] > halfpi) {
            c.rotation[0] = halfpi;
        }
        if (c.rotation[0] < -halfpi) {
            c.rotation[0] = -halfpi;
        }

        c.rotation[1] = ((c.rotation[1] % twopi) + twopi) % twopi;
    }

}

Player.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
    velocity         : [0, 0, 0],
    mouseSensitivity : 0.002,
    maxSpeed         : 3.5,
    friction         : 0.2,
    acceleration     : 20
};
