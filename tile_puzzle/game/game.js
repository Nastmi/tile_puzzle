import { GUI } from '../lib/dat.gui.module.js';

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

class App extends Application {

    start() {
        const gl = this.gl;
        this.renderer = new Renderer(gl);
        this.time = Date.now();
        this.startTime = this.time;
        this.aspect = 1;

        this.light = new Light();

        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);
        this.load('../game/scene.json');
    }

    async load(uri) {
        const scene = await new SceneLoader().loadScene(uri);
        globalThis.gui = new Gui(scene.id);
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
            this.player.disable();
        }
    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;
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
        }

        if(this.scene) {

        }
    }

    render() {
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
    const gui = new GUI();
    gui.add(app, 'enableCamera');
});
