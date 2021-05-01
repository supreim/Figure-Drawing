module.exports = class Figure{
    constructor(imagePaths,activeSession,activeTime){
        this.drawBtn = document.querySelector("#drawBtn");
        this.numOfImgs = document.querySelector(".num-of-imgs");
        this.figure = document.querySelector("#figure");
        this.figureContainer = document.querySelector("#figure-container");
        this.startingPage = document.querySelector("#starting-page");
        this.exit = document.querySelector("#exit");
        this.timeDiv = document.querySelector("#time");
        this.skipLeft= document.querySelector(".skip-left");
        this.pause = document.querySelector(".pause");
        this.skipRight= document.querySelector(".skip-right");
        this.imagePaths = imagePaths;
        this.i = 1;
        this.activeSession = activeSession;
        this.activeTime = activeTime;
        this.timeSeconds = 0;
        this.sessionRunning = true;
        this.timerRunning = true;
        this.sessionChange = false;
        this.sessionActive = true;

    }
    exitToStartingScreen(){
        this.figureContainer.style.display = 'none';
        this.figure.innerHTML = '';
        this.startingPage.style.display = 'flex';
        this.timeSeconds = 0;
        this.sessionRunning = true;
        this.timerRunning = true;
        this.i = 1;
        clearInterval(this.sessionIntervalID);
        this.timeDiv.innerHTML = '';
    };

    fig(){
        this.createImgTags();
        
        let unit = this.activeTime.split("").reverse()[0]
        let intervalLength = parseInt(this.activeTime);

        // if(unit == "s")
        //     intervalLength *= 1000;
        if(unit == "m") 
            intervalLength *= 60;

        this.clock();
        this.controls();
        this.endTimerTime = intervalLength;
        if(this.activeSession === "Practice"){
            // if(unit == "s")
            //     intervalLength *= 1000;
            // else if(unit == "m") 
            //     intervalLength *= 60000;
            this.practice(intervalLength);
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
    }
    practice(time){
        let firstRun = true;
        if(this.timeSeconds < time && firstRun)
            this.figure.appendChild(this.imgTags[0]);
        this.sessionIntervalID = setInterval(()=>{
            if(this.timeSeconds % (time) === 0 && this.timeSeconds >= time && this.sessionActive || this.sessionChange){
                this.figure.innerHTML = '';
                if(this.i < this.imgTags.length){ 
                    this.figure.appendChild(this.imgTags[this.i]);
                    this.i++;
                    firstRun = false;
                    this.sessionActive = false;
                    setTimeout(()=>this.sessionActive = true,1000);
                }
                else{
                    this.exitToStartingScreen();
                }
                this.sessionChange = false;
            }
        },0)
    }
    controls(){
        this.exit.addEventListener('click',()=>this.exitToStartingScreen());
        this.pause.addEventListener('click', ()=>this.timerRunning?this.timerRunning = false:this.timerRunning = true)
        this.skipLeft.addEventListener('click', ()=>{
            if(this.i > 1){
                this.timeSeconds = 0;
                this.i -= 2;
                this.sessionChange = true;
            }
        });
        this.skipRight.addEventListener('click', ()=>{
            if(this.i < this.imgTags.length){
                this.timeSeconds = 0;
                this.sessionChange = true;
            }
        });
    }
    clock(){
        const intervalID = setInterval(()=>{
            if(this.figureContainer.style.display === 'none')
                clearInterval(intervalID);
            else{
                if (this.timerRunning)
                    this.timer(++this.timeSeconds);
                if(this.timeSeconds > this.endTimerTime)
                    this.timeSeconds = 0
                
            }

        },1000);
        return intervalID;
    }
    timer(seconds){
        let timeSecs = (this.endTimerTime - seconds);
        if (timeSecs >= 60){
            let timeMin = (timeSecs / 60);
            this.timeDiv.innerHTML =`<span style="color:white">${timeMin.toFixed(2)}</span>`;
        }
        else
            this.timeDiv.innerHTML =`<span style="color:white">${timeSecs}</span>`;

    }
    createImgTags(){
        this.startingPage.style.display = 'none';
        this.figureContainer.style.display = 'flex';
        this.imgTags = [];

        this.imagePaths.forEach((path)=>{
            let imgTag = document.createElement("img");
            imgTag.src = path;
            imgTag.style.width = '100%';
            // imgTag.style.height = '100%';
            imgTag.style.maxHeight = '650px';
            imgTag.style.objectFit = 'cover';
            imgTag.style.overflow = 'hidden';

            this.imgTags.push(imgTag);
        });
        this.shuffleArray(this.imgTags);
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}



