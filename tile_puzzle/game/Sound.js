export class Sound{

    constructor(){
        this.footsteps = new Audio('../common/audio/footstep.mp3');
        this.down = [false,false,false,false];
    }

    update(){
        if(globalThis.heldKeys["KeyW"])
            this.down[0] = true;
        else
            this.down[0] = false;
        if(globalThis.heldKeys["KeyS"])
            this.down[1] = true;
        else
            this.down[1] = false;
        if(globalThis.heldKeys["KeyD"])
            this.down[2] = true;
        else
            this.down[2] = false;
        if(globalThis.heldKeys["KeyA"])
            this.down[3] = true;
        else
            this.down[3] = false;
        for(let i = 0; i< this.down.length; i++){
            if (this.down[i]){
                this.footsteps.play();
                break;
            }
        }
    }

}