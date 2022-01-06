export class Gui{

    constructor(id){
        this.guiDiv = document.querySelector(".gui");
        this.id = id;
    }

    updateTooltip(select){
        let tooltip = this.guiDiv.querySelector(".tooltip");
        let text = "Search the maze for tiles and bring them to the center!";
        let textColor = "#ffffff";
        switch(select){
            case 1:
                text = "Press E to pick up the tile";
                textColor = "#0000ff";
                break;
            case 2:
                text = "Press Q to place the tile on the grid";
                textColor = "#0000ff";
                break;
            case 3:
                text = "You must have atleast one tile to place it on the grid!"
                textColor = "#ff0000";
                break;
            case 4:
                text = "That tile is correct!"
                textColor = "#37ff00";
                break;
        }
        tooltip.innerHTML = text;
        tooltip.style.color = textColor;
    }

    updatePicked(picked, selected){
        console.log(picked);
        let tileDiv = this.guiDiv.querySelector(".tiles");
        for(let ch = tileDiv.children.length-1; ch >= 0; ch--){
            tileDiv.removeChild(tileDiv.children[ch]);
        }
        for(let i = 0; i < picked.length; i++){
            let cur = picked[i];
            let newImg = document.createElement("img");
            let cont = document.createElement("div");

            newImg.setAttribute("src", "../common/images/puzzle_"+this.id+"/"+cur.id+".png");
            newImg.setAttribute("width", "4%");
            newImg.setAttribute("height", "8%");
            newImg.style.left = Math.floor(i/5)*4.2 + 0.75 + "%";
            newImg.style.top = (0.5+50+(9*(i%5)))+"%";
            newImg.style.position = "fixed";
            cont.style.width = "4%";
            cont.style.height = "9%";
            cont.style.position = "fixed";
            cont.style.left = Math.floor(i/5)*4.2 + 1 + "%";
            cont.style.top = 50+(9*(i%5))+"%";
            newImg.style.clipPath = "inset(0% 0% 0% 11%)"
            cont.style.boxSizing = "border-box";

            if(i == selected)
                cont.style.border = "5px solid #37ff00";
            tileDiv.appendChild(newImg);
            tileDiv.appendChild(cont);

        }
    }

}