const { app, BrowserWindow, Menu, MenuItem, ipcMain, desktopCapturer } = require('electron');
const path = require('node:path')
const isDev = require('electron-is-dev');

app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')
app.commandLine.appendSwitch('disable-gpu-compositing')
app.commandLine.appendSwitch('disable-gpu-rasterization')
app.commandLine.appendSwitch('disable-gpu-sandbox')
app.commandLine.appendSwitch('--no-sandbox')
app.disableHardwareAcceleration();

async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen'],
  });
  inputSources.forEach((source) => {
    // if source main contain '-' (dash) in name, remove everuthing before it
    if (source.name.includes('-')) {
      source.name = source.name.split('-')[1].trim();
    }
  });
  return inputSources;
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 960,
    height: 670,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false,
    resizable: false,
    fullscreenable: false,
    maximizable: false,
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
  if (isDev) {
    win.webContents.openDevTools();
  }

  // Close app
  ipcMain.on('closeApp', () => {
    app.quit()
  })

  // Minimize app
  ipcMain.on('minApp', () => {
    win.minimize()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  win.once('ready-to-show', () => {
    getVideoSources().then((sources) => {
      win.webContents.send('setVideoSources', sources);
    });
  })

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
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bars to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
