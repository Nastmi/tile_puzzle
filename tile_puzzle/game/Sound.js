export class Sound{

    constructor(){
        this.footsteps = new Audio('../common/audio/footstep.mp3');
        this.winGame = new Audio('../common/audio/wingame.mp3');
        this.loseGame = new Audio('../common/audio/losegame.mp3');
        this.cTile = new Audio('../common/audio/correct.mp3');
        this.fTile = new Audio('../common/audio/mistake.mp3');
        this.pickUp = new Audio('../common/audio/pick.mp3');

        this.down = [false,false,false,false];
    }

    update(){
        this.down[0] = !!globalThis.heldKeys["KeyW"];
        this.down[1] = !!globalThis.heldKeys["KeyS"];
        this.down[2] = !!globalThis.heldKeys["KeyD"];
        this.down[3] = !!globalThis.heldKeys["KeyA"];
        for(let i = 0; i< this.down.length; i++){
            if (this.down[i]){
                this.footsteps.play();
                break;
            }
        }
    }

    win(){
        this.winGame.play();
    }

    lose(){
        this.loseGame.play();
    }

    correctTile(){
        this.cTile.play();
    }

    falseTile(){
        this.fTile.play();
    }

    pickUpTile(){
        this.pickUp.play();
    }
}