import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
	send: (event, data) => ipcRenderer.send(event, data),
	on: (event, callback) =>
		ipcRenderer.on(event, (e, ...args) => callback(...args)),

	readFile: (filePath) => ipcRenderer.invoke("fs:readFile", filePath),
	writeFile: (filePath, content) =>
		ipcRenderer.invoke("fs:writeFile", filePath, content),
	deleteFile: (filePath) => ipcRenderer.invoke("fs:deleteFile", filePath),
	createDir: (dirPath) => ipcRenderer.invoke("fs:createDir", dirPath),
	getPath: (name) => ipcRenderer.invoke("fs:getPath", name),
	fileExists: (filePath) => ipcRenderer.invoke("fs:fileExists", filePath),
});
