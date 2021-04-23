const electron = require('electron');
const ipcRenderer = electron.ipcRenderer

const selectFolderBtn = document.querySelector("#selectFolderBtn");
const drawBtn = document.querySelector("#drawBtn");
const nameOfFolder = document.querySelector(".name-of-folder");
const numOfImgs = document.querySelector(".num-of-imgs");
const sessions = document.querySelector("#sessions");
const times = document.querySelector("#times");
const figure = document.querySelector("#figure");
const figureContainer = document.querySelector("#figure-container");
const startingPage = document.querySelector("#starting-page");

const exit = document.querySelector("#exit");
const skipLeft= document.querySelector(".skip-left");
const pause = document.querySelector(".pause");
const skipRight= document.querySelector(".skip-right");

let imagePath;
let os;

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
    });
    
    parent.appendChild(btn);
};

const exitToStartingScreen = ()=>{
    figureContainer.style.display = 'none';
    figure.innerHTML = '';
    startingPage.style.display = 'flex';
};

selectFolderBtn.addEventListener("click",(el)=>{
    // trigger file prompt
    ipcRenderer.send('selectDirectory');
    ipcRenderer.send('getOs');
    
    // handle response
    ipcRenderer.on('chosenFiles', (event, imgNames,os) => {
        imagePath = imgNames;
        if (os === 'WIN')
            folderName = imgNames[0].split('\\').reverse()[1];
        else 
            folderName = imgNames[0].split('/').reverse()[1];

        numImages = imgNames.length;
        nameOfFolder.innerHTML = folderName;
        numOfImgs.innerHTML = numImages;
    });

});

drawBtn.addEventListener("click",(el)=>{
    imgTags = [];
    let figNum;
    i = 1;

    if(imagePath){
        startingPage.style.display = 'none';
        figureContainer.style.display = 'flex';

        imagePath.forEach((path)=>{
            imgTag = document.createElement("img");
            imgTag.src = path;
            imgTag.style.width = '100%';
            imgTag.style.height = '100%';
            imgTag.style.objectFit = 'cover';
            imgTag.style.overflow = 'hidden';

            imgTags.push(imgTag);
        });

        figure.appendChild(imgTags[0]);

        const intervalID = setInterval(()=>{
            if(i < imgTags.length)
                figure.innerHTML = '';
            if(i < imgTags.length){
                figure.appendChild(imgTags[i]);
                i++;
            }
            else{
                clearInterval(intervalID);
            }
        },1000);
        

    }
    else{
        el.target.style.backgroundColor = 'red';
        el.target.innerHTML = 'Select a folder first!';
    }
});

exit.addEventListener('click', (el)=>{
    exitToStartingScreen();
});

drawBtn.addEventListener("mouseout",(el)=>{
    el.target.style.backgroundColor = 'rgb(22, 93, 210)';
    el.target.innerHTML = 'Let\'s draw!';
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
