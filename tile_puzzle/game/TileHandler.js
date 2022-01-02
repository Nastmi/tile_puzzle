//Class for handling "puzzle tiles".

import { vec3, mat4 } from '../lib/gl-matrix-module.js';
import { aabbIntersection, lineBoxIntersection } from './PhysicsFunctions.js';

export class TileHandler{

    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.picked = [];
        this.selected = 0;
    }

    update(dt) {
        this.scene.traverse(node => {
            if (node.type == "tile") {
                if(this.checkRayCollision(node) && globalThis.onceKeys['KeyE']){
                    this.addTile(node);
                    globalThis.onceKeys['KeyE'] = false;
                    globalThis.gui.updatePicked(this.picked, this.selected);
                }
            }
            else if(node.type == "grid_piece"){
                this.checkRayCollision(node)
            }
        });

        //if atleast one tile is picked up, and v is pressed, place it
        if(this.picked.length > 0){
            if(globalThis.onceKeys['KeyQ'] && this.picked.length > 0){
                this.removeTile();
                globalThis.gui.updatePicked(this.picked, this.selected);
            }
        }

        for(let i = 0; i < this.picked.length; i++){
            if(globalThis.onceKeys["Digit"+(i+1)]){
                this.selected = i;
                globalThis.gui.updatePicked(this.picked, this.selected);
            }
        }

        console.log(this.selected);

    }

    checkRayCollision(node){
        let n = this.camera.translation.slice();
        let f = this.camera.getFarPoint();
        const tnode = node.getGlobalTransform();
        const pos = mat4.getTranslation(vec3.create(), tnode);
        const min = vec3.add(vec3.create(), pos, node.aabb.min);
        const max = vec3.add(vec3.create(), pos, node.aabb.max);
        let hit = lineBoxIntersection(n, f, min, max);
        return hit;
    }

    addTile(node) {
            this.picked.push(node);
            this.scene.removeNode(node);
    }

    removeTile(node){
        this.scene.addNode(this.picked[this.selected]);
        this.picked.splice(this.selected, 1);
        globalThis.onceKeys['KeyQ'] = false;
        if(this.selected >= this.picked.length)
                this.selected = Math.max(this.selected--, 0);
    }

    intervalIntersection(min1, max1, min2, max2) {
        return !(min1 > max2 || min2 > max1);
    }

    getPicked(){
        return this.picked;
    }


}