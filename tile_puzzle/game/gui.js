export class Gui{

    constructor(id){
        this.guiDiv = document.querySelector(".gui");
        this.id = id;
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
            newImg.style.left = "0.75%";
            newImg.style.top = 0.5+50+(9*i)+"%";
            newImg.style.position = "fixed";
            cont.style.width = "4%";
            cont.style.height = "9%";
            cont.style.position = "fixed";
            cont.style.left = "1%";
            cont.style.top = 50+(9*i)+"%";
            newImg.style.clipPath = "inset(0% 0% 0% 11%)"
            cont.style.boxSizing = "border-box";
            if(i == selected)
                cont.style.border = "5px solid green";
            tileDiv.appendChild(newImg);
            tileDiv.appendChild(cont);

        }
    }

}