const electron = require('electron');
const ipcRenderer = electron.ipcRenderer
const Figure = require('./pages/figure.js');

const selectFolderBtn = document.querySelector("#selectFolderBtn");
const drawBtn = document.querySelector("#drawBtn");
const nameOfFolder = document.querySelector(".name-of-folder");
const numOfImgs = document.querySelector(".num-of-imgs");
const sessions = document.querySelector("#sessions");
const times = document.querySelector("#times");
const startingPage = document.querySelector("#starting-page");

let imagePaths;
let os;

let activeSession;
let activeTime;

const btnOptions = (parent,text)=>{
    const btn = document.createElement('button');
    btn.innerHTML = `${text}`;
    btn.style.border = 'none';
    btn.style.outline = 'none';
    btn.classList.add('unactive');

    btn.addEventListener('click', (el)=>{
        
        parent.childNodes.forEach(child =>{
            child.classList.remove('active');
            child.classList.add('unactive');
        });
        el.target.classList.add('active');
        el.target.classList.remove('unactive');

        if(parent === sessions)
            activeSession = btn.innerHTML;
        if(parent === times){
            activeTime = btn.innerHTML;
        }
    });
    
    parent.appendChild(btn);
};



selectFolderBtn.addEventListener("click",(el)=>{
    // trigger file prompt
    ipcRenderer.send('selectDirectory');
    ipcRenderer.send('getOs');
    
    // handle response
    ipcRenderer.on('chosenFiles', (event, imgNames,os) => {
        imagePaths = imgNames;
        if (os === 'WIN')
            folderName = imgNames[0].split('\\').reverse()[1];
        else 
            folderName = imgNames[0].split('/').reverse()[1];

        numImages = imgNames.length;
        nameOfFolder.innerHTML = folderName;
        numOfImgs.innerHTML = numImages;
    });

});

drawBtn.addEventListener("mouseout",(el)=>{
    el.target.style.backgroundColor = 'rgb(22, 93, 210)';
    el.target.innerHTML = 'Let\'s draw!';
});


drawBtn.addEventListener("click",(el)=>{
    if(!imagePaths){
        el.target.style.backgroundColor = 'red';
        el.target.innerHTML = 'Select a folder first!';
    }
    else if(!activeSession){
        el.target.style.backgroundColor = 'red';
        el.target.innerHTML = 'Select a Session Type first!';
    }
    else if(!activeTime){
        el.target.style.backgroundColor = 'red';
        el.target.innerHTML = 'Select a Time first!';
    }
    else{
        const fig = new Figure(imagePaths,activeSession,activeTime);
        fig.fig();
    }
});
 
btnOptions(times,'30s');
btnOptions(times,'45s');
btnOptions(times,'1m');
btnOptions(times,'2m');
btnOptions(times,'5m');
btnOptions(times,'10m');

btnOptions(sessions,'Practice');
btnOptions(sessions,'Class');
btnOptions(sessions,'Relaxed');
btnOptions(sessions,'Custom');
