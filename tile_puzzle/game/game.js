import { Application } from '../common/engine/Application.js';

import { Renderer } from './Renderer.js';
import { Physics } from './Physics.js';
import { Camera } from './Camera.js';
import { Player } from './Player.js';
import { SceneLoader } from './SceneLoader.js';
import { SceneBuilder } from './SceneBuilder.js';
import { TileHandler } from './TileHandler.js';
import { InputHandler } from './InputHandler.js';
import { Gui } from "./gui.js";
import { Light } from "./Light.js";
import { Sound } from "./Sound.js"

class App extends Application {
    start() {
        this.canvas = document.querySelector('canvas');
        const gl = this.gl;
        this.renderer = new Renderer(gl);
        this.time = Date.now();
        this.startTime = this.time;
        this.totalTime = Date.now();
        this.offset = 0;
        this.aspect = 1;
        this.light = new Light();
        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);
        this.load('../game/scene.json');
    }

    async load(uri) {
        const scene = await new SceneLoader().loadScene(uri);
        const builder = new SceneBuilder(scene);
        this.scene = builder.build();
        this.physics = new Physics(this.scene);
        this.inputHandler = new InputHandler();
        // Find first camera.
        this.player = null;
        this.scene.traverse(node => {
            if (node instanceof Player) {
                this.player = node;
            }
        });
        //camera for minimap
        this.camera = null;
        this.scene.traverse(node => {
            if (node instanceof Camera) {
                this.camera = node;
            }
        });
        this.player.aspect = this.aspect;
        this.player.updateProjection();
        this.camera.aspect = this.aspect;
        this.camera.updateProjection();
        this.scene.addNode(this.player.playerModel);
        this.renderer.prepare(this.scene);
        //Create a handler for tiles
        this.tileHandler = new TileHandler(this.scene, this.player, scene.num);
        this.sound = new Sound();
        this.win = false;
        globalThis.gui = new Gui(scene.id);
    }

    enableCamera() {
        this.canvas.requestPointerLock();
    }

    pointerlockchangeHandler() {
        if (!this.player) {
            return;
        }

        if (document.pointerLockElement === this.canvas) {
            this.player.enable();
        } else {
            this.offset += Date.now() - this.totalTime;
            this.player.disable();
            document.addEventListener("mousedown", () => {
                this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
                this.canvas.mozRequestPointerLock;
                this.canvas.requestPointerLock();
            })
        }
    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;
        if(this.totalTime && document.pointerLockElement === this.canvas && globalThis.gui){
            let timeToEnd = globalThis.gui.updateGlobalTime(this.totalTime-this.offset, t);
            if(timeToEnd <= 0){
                this.totalTime = null;
                this.handleLoss();
            }
        }
        else{
            this.totalTime = Date.now();
        }
        let arr;
        if (this.player) {
            arr = this.player.update(dt);
        }
        if(this.camera) {
            this.camera.update(this.player.translation[0], this.player.translation[2]);
        }

        if (this.physics) {
            this.physics.update(dt);
        }
        if(this.tileHandler) {
            this.tileHandler.update(dt);
            if(!this.win && this.tileHandler.checkWin()){
                this.win = true;
                this.handleWin();
            }
        }
        if(this.sound && document.pointerLockElement === this.canvas)
            this.sound.update();
    }

    handleLoss(){
        this.sound.lose();
        document.exitPointerLock();
        this.canvas.requestPointerLock = null;
        Swal.fire({
            title: "Time is up! You lost!",
            text: "What do you want to do?",
            confirmButtonText: "Try again",
            cancelButtonText: "Go to menu",
            customClass: {
                icon: 'icon-right'
            },
            iconHtml:"<img src='../common/images/cropped.png' width='168px' height='168px'>",
            showCancelButton: true,
            background: "#f5f1d9",
            allowOutsideClick: false,
            backdrop: `
                rgba(0,0,0,0.7)
            `
        }).then(function(result){
            if(result.value)
                window.location.href = "../html/game.html";
            else
                window.location.href = "../index.html";
        })
    }

    handleWin(){
        this.sound.win();
        document.exitPointerLock();
        this.canvas.requestPointerLock = null;
        Swal.fire({
            title: "You won!",
            text: "What do you want to do?",
            confirmButtonText: "Play again",
            cancelButtonText: "Go to menu",
            customClass: {
                icon: 'icon-right'
            },
            iconHtml:"<img src='../common/images/cropped.png' width='168px' height='168px'>",
            showCancelButton: true,
            background: "#f5f1d9",
            allowOutsideClick: false,
            backdrop: `
                rgba(0,0,0,0.7)
            `
        }).then(function(result){
            if(result.value)
                window.location.href = "../html/game.html";
            else
                window.location.href = "../index.html";
        })
    }

    render(){
        if (this.scene) {
            this.renderer.render(this.scene, this.player, this.camera, this.light);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        this.aspect = w / h;
        if (this.player) {
            this.player.aspect = this.aspect;
            this.player.updateProjection();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);
    Swal.fire({
        title: "Tile puzzle game!\nInstructions",
        html: `You are placed in a dark maze, and you must assemble together a picture out of tiles. 
        Explore the maze to find them and pick them up by pressing <b>E</b> while looking at them. Bring them to the center and assemble
            them on the grid with <b>Q</b>. Move using <b>WASD</b>. Toggle the minimap using <b>M</b>, but beware!
            You can only use the minimap for 60 seconds in total!`,
        confirmButtonText: "Play",
        cancelButtonText: "Go back to menu",
        customClass: {
            icon: 'icon-right'
        },
        iconHtml:"<img src='../common/images/cropped.png' width='168px' height='168px'>",
        background: "#f5f1d9",
        allowOutsideClick: false,
        showCancelButton: true,
        backdrop: `
            rgba(0,0,0,0.7)
        `
    }).then(function(result){
        if(!result.value)
            window.location.href = "../index.html";
        canvas.requestPointerLock = canvas.requestPointerLock ||
        canvas.mozRequestPointerLock;
        canvas.requestPointerLock();
    })
});