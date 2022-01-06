import { Mesh } from './Mesh.js';

import { Node } from './Node.js';
import { Model } from './Model.js';
import { Camera } from './Camera.js';

import { Scene } from './Scene.js';
import { Player } from './Player.js';

export class SceneBuilder {

    constructor(spec) {
        this.spec = spec;
    }

    createNode(spec) {
        switch (spec.type) {
            case 'camera': {
                return new Camera(spec);
            }
            case 'player': {
                let playerModel = {
                    "type": "model",
                    "mesh": 0,
                    "texture": 6,
                    "aabb": {
                      "min": [-1,-100,-6],
                      "max": [1,-99,6]
                    },
                    "translation": [0, 0, 0],
                    "scale": [0.7,1,0.7]
                }
                playerModel = this.createNode(playerModel);
                return new Player(spec, playerModel);
            }
            case "pointer":
            case "grid_piece":
            case "tile":
            case 'model': {
                const mesh = new Mesh(this.spec.meshes[spec.mesh]);
                const texture = this.spec.textures[spec.texture];
                return new Model(spec.type, mesh, texture, spec);
            }
            default: return new Node(spec);
        }
    }

    build() {
        let scene = new Scene();
        this.spec.nodes.forEach(spec => scene.addNode(this.createNode(spec)));
        return scene;
    }

}
