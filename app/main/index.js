import { app, BrowserWindow } from "electron";
import { join } from "node:path";
import { is } from "@electron-toolkit/utils";
import { initWindowHandlers } from "./windowHandlers.js";
import { initFileHandlers } from "./fileHandlers.js";

let mainWindow = null;
initFileHandlers();

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: join(__dirname, "../preload/index.js"),
		},
		frame: false,
	});

	initWindowHandlers(mainWindow);

	if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
		mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}

	mainWindow.webContents.on("dom-ready", () => {
		mainWindow.webContents.send("userDocuments", app.getPath("documents"));
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(createWindow);