import { Node } from './Node.js';

export class Light extends Node {

    constructor() {
        super();

        Object.assign(this, {
            position         : [0, 1, 0],
            ambientColor     : [200, 200, 200],
            diffuseColor     : [100, 100, 100],
            specularColor    : [0, 0, 0],
            shininess        : 1,
            attenuatuion     : [1.0, 0, 0.03]
        });
    }

}