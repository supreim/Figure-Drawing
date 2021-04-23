const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
// const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
// const {app, BrowserWindow} = require('electron');
const  {ipcMain,dialog} = require("electron");
const fs = require('fs');

let win;
let dir

function createWindow() {

  win = new BrowserWindow({ width: 500, height: 800 })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  let contents = win.webContents

  win.on('closed', () => {
    win = null
  });
  
  win.setMenu(null)
  // open dev tools
  // win.webContents.openDevTools()
}


app.on('ready', ()=>{
  createWindow()

  // Promtpt user to select folder
  ipcMain.on('selectDirectory',(event,arg)=>{
    let result = [];
    let os

    if(process.platform !== 'linux' && process.platform !== 'darwin')
      os = 'WIN';
    else 
      os = 'NOT_WIN';

    // prompts the user to choose a folder
    dir = dialog.showOpenDialog(win,{
      properties:['openDirectory'],
      filters:[{name:"Images"},{extensions:["png","jpg","jpeg"]}]
    });

    // path to folder
    dir = dir[0];

    // reading from folder
    fs.readdir(dir,(err,files)=>{
      if(err)
        console.log(err);
      else{
        files.forEach(file => {
          if(path.extname(file) === ".png" || path.extname(file) === ".jpg"){
            result.push(path.join(dir,file));
          }
        });

        // sending result to renderer through the 'chosenFiles' tunnel
        if(result.length > 0)
          win.webContents.send('chosenFiles', result,os);
      }
    });

  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
