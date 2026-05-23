const { app, BrowserWindow, ipcMain } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false,
  })
  win.loadFile('index.html')

  ipcMain.on('window-minimize', () => win.minimize());
  ipcMain.on('window-maximize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize();
  });
  
  ipcMain.on('window-close', () => win.close());

  ipcMain.on('window-drag', (event, {deltaX, deltaY}) => {
    const [x, y] = win.getPosition();
    win.setPosition(x + deltaX, y + deltaY);
  });

}

app.on('window-all-closed', () => {
  app.quit()
})

app.whenReady().then(createWindow)