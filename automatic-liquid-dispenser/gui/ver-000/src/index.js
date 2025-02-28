const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');





// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  // *** Suresh Code
  ipcMain.on('exec', (event, arg) => {
    console.log(arg) // prints "ping"
    exec(arg, (error, stdout, stderr) => {
        if (error) {
          event.reply('asynchronous-reply', error.message);
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          event.reply('asynchronous-reply', stderr);
          console.log(`stderr: ${stderr}`);
          return;
        }
        event.reply('asynchronous-reply', stdout);
        console.log(`stdout: ${stdout}`);
    });
  })
  
  mainWindow.menuBarVisible = false;
  mainWindow.maximize();

  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = 'pong'
  })



//x-term start

const os = require('os');
const pty = require('node-pty');

var shell = os.platform() === "win32" ? "powershell.exe" : "bash";
var ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 40,
        cwd: process.env.HOME,
        env: process.env
    });
    

    ptyProcess.onData((data) => {
      mainWindow.webContents.send("terminal-incData", data);
    });

    ipcMain.on("terminal-into", (event, data)=> {
      ptyProcess.write(data);
    })
    
//x-term end






};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


