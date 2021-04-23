module.exports = class Figure{
    constructor(imagePaths,activeSession,activeTime){
        this.drawBtn = document.querySelector("#drawBtn");
        this.numOfImgs = document.querySelector(".num-of-imgs");
        this.figure = document.querySelector("#figure");
        this.figureContainer = document.querySelector("#figure-container");
        this.startingPage = document.querySelector("#starting-page");
        this.exit = document.querySelector("#exit");
        this.skipLeft= document.querySelector(".skip-left");
        this.pause = document.querySelector(".pause");
        this.skipRight= document.querySelector(".skip-right");
        this.imagePaths = imagePaths;
        this.i = 1;
        this.activeSession = activeSession;
        this.activeTime = activeTime;
    }
    exitToStartingScreen(intervalID){
        this.figureContainer.style.display = 'none';
        this.figure.innerHTML = '';
        this.startingPage.style.display = 'flex';
        clearInterval(intervalID);
    };

    fig(){
        this.createImgTags();
        
        let unit = this.activeTime.split("").reverse()[0]
        let intervalLength = parseInt(this.activeTime);
        let intervalID;

        if(unit == "s")
            intervalLength *= 1000;
        if(unit == "m") 
            intervalLength *= 60000

        if(this.activeSession === "Practice"){
            intervalID = this.practice(intervalLength);
        }
        if(this.activeSession == "Class"){
            console.log("Class");
        }
        if(this.activeSession == "Relaxed"){
            console.log("Relaxed");
        }
        if(this.activeSession == "Custom"){
            console.log("Custom");
        }

        this.controls(intervalID);

    }
    practice(time){
        this.figure.appendChild(this.imgTags[0]);
        const intervalID = setInterval(()=>{
            // if(this.i < this.imgTags.length)
            this.figure.innerHTML = '';
            if(this.i < this.imgTags.length){
                this.figure.appendChild(this.imgTags[this.i]);
                this.i++;
            }
            else{
                // clearInterval(intervalID);
                this.exitToStartingScreen(intervalID);
            }
        },time);

        return intervalID;
    }
    controls(intervalID){
        this.exit.addEventListener('click',()=>this.exitToStartingScreen(intervalID));
    }
    clock(update){
        this.time = 0;
        const intervalID = setInterval(()=>{
            if(this.figureContainer.style.display === 'none')
                clearInterval(interalID);
            else{
                this.time += update
            }

        },update * 1000);
        return intervalID;
    }
    createImgTags(){
        this.startingPage.style.display = 'none';
        this.figureContainer.style.display = 'flex';
        this.imgTags = [];

        this.imagePaths.forEach((path)=>{
            let imgTag = document.createElement("img");
            imgTag.src = path;
            imgTag.style.width = '100%';
            imgTag.style.height = '100%';
            imgTag.style.objectFit = 'cover';
            imgTag.style.overflow = 'hidden';

            this.imgTags.push(imgTag);
        });
    }
}



