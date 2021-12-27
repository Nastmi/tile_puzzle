import { Node } from './Node.js';

export class Model extends Node {

    constructor(type, mesh, image, options) {
        super(options);
        this.type = type;
        this.mesh = mesh;
        this.image = image;
    }

}
