//Class for handling "puzzle tiles".

import { vec3, mat4 } from '../lib/gl-matrix-module.js';
import { aabbIntersection, lineBoxIntersection } from './PhysicsFunctions.js';

export class TileHandler{

    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.picked = [];
    }

    update(dt) {
        this.scene.traverse(node => {
            if (node.type == "tile") {
                this.addTile(node);
            }
            else if(node.type == "grid_piece"){
                this.checkGridCollision(node)
            }
        });

        //if atleast one tile is picked up, and v is pressed, place it
        if(this.picked.length > 0){
            if(globalThis.onceKeys['KeyV']){
                this.scene.addNode(this.picked.pop());
                globalThis.onceKeys['KeyV'] = false;
            }
        }

    }

    checkGridCollision(node){
        let n = this.camera.translation.slice();
        let f = this.camera.getFarPoint();
        let hit = lineBoxIntersection(node.aabb.min, node.aabb.max, n, f, true);
        if(hit)
            console.log("hitted");
    }

    addTile(node) {
            // Update bounding boxes with global translation.
            const ta = node.getGlobalTransform();
            const tb = this.camera.getGlobalTransform();
    
            const posa = mat4.getTranslation(vec3.create(), ta);
            const posb = mat4.getTranslation(vec3.create(), tb);
            const mina = vec3.add(vec3.create(), posa, node.aabb.min);
            const maxa = vec3.add(vec3.create(), posa, node.aabb.max);
            const minb = vec3.add(vec3.create(), posb, this.camera.aabb.min);
            const maxb = vec3.add(vec3.create(), posb, this.camera.aabb.max);
    
            // Check if there is collision.
            const isColliding = aabbIntersection({
                min: mina,
                max: maxa
            }, {
                min: minb,
                max: maxb
            });
    
            if (!isColliding) {
                return;
            }

            //If there is collision, add tile to the picked tiles, and remove it from scene.
            this.picked.push(node);
            this.scene.removeNode(node);
    }

    intervalIntersection(min1, max1, min2, max2) {
        return !(min1 > max2 || min2 > max1);
    }


}