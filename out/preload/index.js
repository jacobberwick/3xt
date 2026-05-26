"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  send: (event, data) => electron.ipcRenderer.send(event, data),
  on: (event, callback) => electron.ipcRenderer.on(event, (e, ...args) => callback(...args)),
  readFile: (filePath) => electron.ipcRenderer.invoke("fs:readFile", filePath),
  writeFile: (filePath, content) => electron.ipcRenderer.invoke("fs:writeFile", filePath, content),
  deleteFile: (filePath) => electron.ipcRenderer.invoke("fs:deleteFile", filePath),
  createDir: (dirPath) => electron.ipcRenderer.invoke("fs:createDir", dirPath),
  getPath: (name) => electron.ipcRenderer.invoke("fs:getPath", name),
  fileExists: (filePath) => electron.ipcRenderer.invoke("fs:fileExists", filePath)
});
