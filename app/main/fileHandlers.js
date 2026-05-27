import { ipcMain, app } from "electron";
import fs from "node:fs";

/**
 * Registers all file system IPC handlers for the main process.
 * Called once on app startup before any window is created.
 *
 * Handlers are invoked from the renderer via window.electronAPI (defined in preload.js).
 * Uses Node.js fs module to perform actual disk operations.
 *
 * Registered channels:
 * - fs:readFile    — read file contents as UTF-8 string
 * - fs:writeFile   — write string content to file (overwrites)
 * - fs:deleteFile  — permanently delete a file
 * - fs:renameFile  — rename or move a file
 * - fs:createDir   — create directory recursively
 * - fs:fileExists  — check if a file exists on disk
 * - fs:getPath     — get an Electron app path by name (e.g. "documents", "userData")
 *
 * @export
 */
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

	ipcMain.handle("fs:renameFile", (event, oldPath, newPath) => {
		fs.renameSync(oldPath, newPath);
		return newPath;
	});
}
