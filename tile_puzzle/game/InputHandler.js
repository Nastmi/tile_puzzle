//Sets which keys are pressed. Classes can the pull this (global) information.

export class InputHandler{
    
    constructor(){
        //Keys that are being held
        globalThis.heldKeys = {};
        //Keys that should only react once
        globalThis.onceKeys = {};
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    keydownHandler(e) {
        if(e.repeat) { return }
        globalThis.heldKeys[e.code] = true;
        globalThis.onceKeys[e.code] = true;
    }

    keyupHandler(e) {
        globalThis.heldKeys[e.code] = false;
        globalThis.onceKeys[e.code] = false;
    }

}