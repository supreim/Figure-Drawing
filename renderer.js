// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
import { ipcRenderer } from 'electron';

const selectFolderBtn = document.querySelector("#selectFolderBtn");
const drawBtn = document.querySelector("#drawBtn");
const nameOfFolder = document.querySelector(".name-of-folder");
const numOfImgs = document.querySelector(".num-of-imgs");
const sessions = document.querySelector("#sessions");
const times = document.querySelector("#times");
const figure = document.querySelector("#figure");
const startingPage = document.querySelector("#starting-page");

const startDrawing = (el)=>{
    startingPage.style.display = 'none';
    figure.style.display = 'block';
}

selectFolderBtn.addEventListener("click",(el)=>{
    console.log("You clicked A Button");
    // trigger file prompt
    ipcRenderer.send('chooseFile');
});

drawBtn.addEventListener("click",(el)=>{
    console.log("You clicked A Button");
    console.log(src);
});

// handle response
ipcRenderer.on('chosenFile', (event, base64) => {
    const src = `data:image/jpg;base64,${base64}`
  })
  
