import { Node } from './Node.js';

export class Light extends Node {

    constructor() {
        super();

        Object.assign(this, {
            position         : [-100, 1, 50],
            ambientColor     : [233, 233, 233],
            diffuseColor     : [204, 204, 204],
            specularColor    : [255, 255, 255],
            shininess        : 10,
            attenuatuion     : [1.0, 0, 0.02]
        });
    }

}