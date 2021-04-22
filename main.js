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

  win = new BrowserWindow({ width: 800, height: 600 })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  let contents = win.webContents

  win.on('closed', () => {
    win = null
  });
  win.webContents.openDevTools()
}


app.on('ready', ()=>{
  createWindow()

  // Promtpt user to select folder
  ipcMain.on('selectDirectory',(event,arg)=>{
    let result = [];

    dir = dialog.showOpenDialog(win,{
      properties:['openDirectory'],
      filters:[{name:"Images"},{extensions:["png","jpg","jpeg"]}]
    });
    dir = dir[0];
    console.log(dir);

    fs.readdir(dir,(err,files)=>{
      if(err)
        console.log(err);
      else{

        files.forEach(file => {
          if(path.extname(file) === ".png" || path.extname(file) === ".jpg"){

            result.push(path.join(dir,file));
          }
        });
        console.log(result);
        win.webContents.send('chosenFiles', result);
      }
    });

  });

  // ipcMain.on("chooseFile", (event, arg) => {
  //   const result = dialog.showOpenDialog({
  //     properties: ["openFile"],
  //     filters: [{ name: "Images", extensions: ["png","jpg","jpeg"] }]
  //   });

    console.log(dir);
    // 
  
    // result.then(({canceled, filePaths, bookmarks}) => {
    //   const base64 = fs.readFileSync(filePaths[0]).toString('base64');
    // event.reply("chosenFile", result);
    // });
  // });
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
