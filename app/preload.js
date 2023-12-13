const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('btnEvent', {
  close: () => ipcRenderer.send('closeApp'),
  min: () => ipcRenderer.send('minApp'),
  fs: () => ipcRenderer.send('fsApp'),
  win: () => ipcRenderer.send('winApp'),
  onMaximized: (callback) => ipcRenderer.on('maximized', () => callback()),
  onWindowed: (callback) => ipcRenderer.on('windowed', () => callback()),
})