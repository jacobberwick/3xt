"use strict";
const electron = require("electron");
const node_path = require("node:path");
const utils = require("@electron-toolkit/utils");
const fs = require("node:fs");
function initWindowHandlers(mainWindow2) {
  electron.ipcMain.on("window-minimize", () => mainWindow2.minimize());
  electron.ipcMain.on("window-maximize", () => {
    mainWindow2.isMaximized() ? mainWindow2.unmaximize() : mainWindow2.maximize();
  });
  electron.ipcMain.on("window-close", () => mainWindow2.close());
  electron.ipcMain.on("window-drag", (event, { deltaX, deltaY }) => {
    const [x, y] = mainWindow2.getPosition();
    mainWindow2.setPosition(x + deltaX, y + deltaY);
  });
}
function initFileHandlers() {
  electron.ipcMain.handle("fs:readFile", (event, filePath) => {
    return fs.readFileSync(filePath, "utf-8");
  });
  electron.ipcMain.handle("fs:writeFile", (event, filePath, content) => {
    fs.writeFileSync(filePath, content);
  });
  electron.ipcMain.handle("fs:deleteFile", (event, filePath) => {
    fs.unlinkSync(filePath);
  });
  electron.ipcMain.handle("fs:createDir", (event, dirPath) => {
    fs.mkdirSync(dirPath, { recursive: true });
  });
  electron.ipcMain.handle("fs:getPath", (event, name) => {
    return electron.app.getPath(name);
  });
  electron.ipcMain.handle("fs:fileExists", (event, filePath) => {
    return fs.existsSync(filePath);
  });
}
let mainWindow = null;
initFileHandlers();
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: node_path.join(__dirname, "../preload/index.js")
    },
    frame: false
  });
  initWindowHandlers(mainWindow);
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(node_path.join(__dirname, "../renderer/index.html"));
  }
  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.webContents.send("userDocuments", electron.app.getPath("documents"));
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
});
electron.app.whenReady().then(createWindow);
