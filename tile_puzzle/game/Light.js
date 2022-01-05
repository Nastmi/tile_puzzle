import { Node } from './Node.js';

export class Light extends Node {

    constructor() {
        super();

        Object.assign(this, {
            position         : [-100, 1, 50],
            ambientColor     : [255, 255, 255],
            diffuseColor     : [100, 100, 100],
            specularColor    : [0, 0, 0],
            shininess        : 1,
            attenuatuion     : [1.0, 0, 0.03]
        });
    }

}