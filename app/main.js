const { app, BrowserWindow, Menu, MenuItem, ipcMain } = require('electron');
const path = require('node:path')
// const isDev = require('electron-is-dev');

function createWindow() {

  // Create the browser window.
  const win = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 600,
    minHeight: 400,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false,
  });

  // and load the index.html of the app.
  win.loadFile("src/index.html");
  // React specific code :
  // win.loadURL(
  //   isDev
  //     ? 'http://localhost:3000'
  //     : require('node:path').join(__dirname, '../build/index.html')
  // );

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Close app
  ipcMain.on('closeApp', () => {
    app.quit()
  })

  // Minimize app
  ipcMain.on('minApp', () => {
    win.minimize()
  })

  // Fullscreen app
  ipcMain.on('fsApp', () => {
    win.maximize()
  })
  win.on('maximize', () => {
    win.webContents.send('maximized')
  })

  // Windowed app
  ipcMain.on('winApp', () => {
    win.unmaximize()
  })
  win.on('unmaximize', () => {
    win.webContents.send('windowed')
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}

// Local (when focus is on window) shortcut
const menu = new Menu()
menu.append(new MenuItem({
  label: 'Quit',
  submenu: [{
    role: 'Quit',
    accelerator: 'Esc',
    click: () => { app.quit() }
  }]
}))

Menu.setApplicationMenu(menu)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bars to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
