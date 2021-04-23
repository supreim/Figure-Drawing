// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// import { createRequire } from 'module'
// const require = createRequire(import.meta.url);
// import { ipcRenderer } from 'electron';
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

let imagePath;



selectFolderBtn.addEventListener("click",(el)=>{
    // trigger file prompt
    ipcRenderer.send('selectDirectory');

    // handle response
    ipcRenderer.on('chosenFiles', (event, imgNames) => {
        imagePath = imgNames;
        folderName = imgNames[0].split('\\').reverse()[1];
        numImages = imgNames.length;

        nameOfFolder.innerHTML = folderName;
        numOfImgs.innerHTML = numImages;


        // src = `data:image/jpg;base64,${base64}`
        // console.log(src);
    });

});

drawBtn.addEventListener("click",(el)=>{
    imgTags = [];

    if(imagePath){
        console.log(imagePath);
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
    }
    else{
        console.log("Please Select a folder first!");
    }
});


  
