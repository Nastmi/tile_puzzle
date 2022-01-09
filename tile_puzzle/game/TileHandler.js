//Class for handling "puzzle tiles".

import {mat4, vec3} from '../lib/gl-matrix-module.js';
import {lineBoxIntersection} from './PhysicsFunctions.js';
import {Sound} from "./Sound.js";

export class TileHandler{

    constructor(scene, camera, num) {
        this.scene = scene;
        this.camera = camera;
        this.picked = [];
        this.selected = 0;
        this.num = num;
        this.scene.traverse(node => {
            if(node.type === "pointer")
                this.pointer = node;
        });
        this.sound = new Sound();
    }

    update() {
        let pVis = false;
        let eventO = false;
        this.scene.traverse(node => {
            //if node is tile, not in correct postition and E is pressed, add it our "inventory".
            if (node.type === "tile") {
                if(this.checkRayCollision(node)){
                    eventO = true;
                    if(!node.correct){
                        //If looking at tile, make pointer visible.
                        this.pointer.visible = true;
                        this.pointer.translation = node.translation.slice();
                        this.pointer.translation[1] += 0.5;
                        pVis = true;
                        globalThis.gui.updateTooltip(1);
                        if(globalThis.onceKeys['KeyE']){
                            this.addTile(node);
                            globalThis.onceKeys['KeyE'] = false;
                            globalThis.gui.updatePicked(this.picked, this.selected);
                            //If tile picked up, make pointer invisible.
                            this.pointer.visible = false;
                            globalThis.gui.updateTooltip(0);
                        }
                    }
                    else
                        globalThis.gui.updateTooltip(4);
                }
            }
            //if node is grid piece, doesn't have the correct tile on it and q is pressed, attempt to add the currently selected node to it.
            else if(node.type === "grid_piece"){
                if(this.checkRayCollision(node)){
                    eventO = true;
                    if(!node.correct){
                        //if looking at grid, make pointer visible (unless it already has a tile, then you can interact with it).
                        if(this.picked.length <= 0)
                            globalThis.gui.updateTooltip(3);
                        if(!node.filled && this.picked.length > 0){
                            this.pointer.visible = true;
                            this.pointer.translation = node.translation.slice();
                            this.pointer.translation[1] += 0.5;
                            pVis = true;
                            globalThis.gui.updateTooltip(2);
                        }
                        if(globalThis.onceKeys['KeyQ']){
                            this.place(node);
                            globalThis.onceKeys['KeyQ'] = false;
                            globalThis.gui.updatePicked(this.picked, this.selected);
                            //if node was placed, make pointer invisible.
                            this.pointer.visible = false;
                            globalThis.gui.updateTooltip(0);
                        }
                    }
                    else
                        globalThis.gui.updateTooltip(4);
                }
            }
        });

        if(!pVis)
            this.pointer.visible = false;
        if(globalThis.gui && !eventO)
            globalThis.gui.updateTooltip(0);
        this.pointer.updateTransform(0);

        //select the node corresppodning to the currently pressed digit
        for(let i = 0; i < this.picked.length; i++){
            if(globalThis.onceKeys["Digit"+(i+1)] || globalThis.onceKeys["Numpad"+(i+1)]){
                this.selected = i;
                globalThis.gui.updatePicked(this.picked, this.selected);
            }
        }
    }

    //place the node on a grid, if player is looking at it, and noode exists
    place(node){
        if(!node.filled && this.picked.length > 0){
            node.filled  = true;
            let toPlace = this.picked[this.selected];
            toPlace.translation = node.translation.slice();
            if(!toPlace.on_grid)
                toPlace.translation[1] += 0.05;
            toPlace.rotation = node.rotation.slice();
            this.removeTile(toPlace);
            toPlace.updateTransform();
            toPlace.on_grid = true;
            toPlace.grid = node;
            if(node.id === toPlace.id){
                node.correct =  true;
                toPlace.correct = true;
                this.sound.correctTile();
            }else{
                this.sound.falseTile();
            }
        }
    }

    //Check if all tiles are correct
    checkWin(){
        let cor = 0;
        this.scene.traverse(node => {
            if(node.type === "tile" && node.correct)
                cor++;
        });
        if(cor === this.num){
            return true;
        }
    }

    //check if player is looking at a node
    checkRayCollision(node){
        let n = this.camera.translation.slice();
        let f = this.camera.getFarPoint();
        const tnode = node.getGlobalTransform();
        const pos = mat4.getTranslation(vec3.create(), tnode);
        const min = vec3.add(vec3.create(), pos, node.aabb.min);
        const max = vec3.add(vec3.create(), pos, node.aabb.max);
        return lineBoxIntersection(n, f, min, max);
    }

    //add node to the "inventory". If it was on the grid, lower it's vertical coordinates and remove the grid piece it was on from it's attributes.
    addTile(node) {
        this.picked.push(node);
        this.sound.pickUpTile();
        this.scene.removeNode(node);
        if(node.on_grid){
            node.on_grid = false;
            node.translation[1] -= 0.05;
        }
        if(node.grid != null){
            node.grid.filled = false;
            node.grid = null;
        }
    }

    //Remove the node from "inventory" and add it back into the scene. Also fix which node is currently selected.
    removeTile(){
        this.scene.addNode(this.picked[this.selected]);
        this.picked.splice(this.selected, 1);
        if(this.selected >= this.picked.length){
            this.selected--;
            this.selected = Math.max(this.selected, 0);
        }
    }

    getPicked(){
        return this.picked;
    }
}