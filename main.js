const { app, BrowserWindow } = require('electron')

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1100,
      height: 900, 
      transparent: true,
      frame: false,
      webPreferences: {
        nodeIntegration: true
      }
    })
  
    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`)
  
    // Open the DevTools.
    //mainWindow.webContents.openDevTools()
  
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })
  }

  app.on('ready', createWindow)
  