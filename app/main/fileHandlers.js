import { ipcMain, app } from "electron";
import fs from "node:fs";

export function initFileHandlers() {
	ipcMain.handle("fs:readFile", (event, filePath) => {
		return fs.readFileSync(filePath, "utf-8");
	});

	ipcMain.handle("fs:writeFile", (event, filePath, content) => {
		fs.writeFileSync(filePath, content);
	});

	ipcMain.handle("fs:deleteFile", (event, filePath) => {
		fs.unlinkSync(filePath);
	});

	ipcMain.handle("fs:createDir", (event, dirPath) => {
		fs.mkdirSync(dirPath, { recursive: true });
	});

	ipcMain.handle("fs:getPath", (event, name) => {
		return app.getPath(name);
	});

	ipcMain.handle("fs:fileExists", (event, filePath) => {
		return fs.existsSync(filePath);
	});
}
