// from https://dev.to/mandiwise/electron-apps-made-easy-with-create-react-app-and-electron-forge-560e
const wsjtx = require('./components/Connections/wsjtx')

const path = require("path");
const { app, ipcMain, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS; 
let mainWindow;

if (isDev) {
  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
} 

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
    app.quit();
  } 

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 625,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: `${__dirname}/preload.js`,
      webSecurity: false 
    }
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  const wsjtx_client = new wsjtx();
  wsjtx_client.on('qso', (qso)=>{mainWindow.webContents.send('qso', qso)})
  wsjtx_client.on('heartbeat', ()=>{mainWindow.webContents.send('heartbeat')})
  // wsjtx_client.on('status', (obj) => { this.setState({pluginStat: Object.assign({}, this.state.pluginStat, obj)}) })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
  
    if (isDev) {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(error => console.log(`An error occurred: , ${error}`));
    }
  }); 

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('always-on-top', (event, arg) => {
  mainWindow.setAlwaysOnTop(arg, "floating", 1);
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
