const { app, BrowserWindow, ipcMain } = require("electron");

let window = null;

ipcMain.on("window-minimize", () => window.minimize());
ipcMain.on("window-maximize", () => {
	window.isMaximized() ? window.unmaximize() : window.maximize();
});
ipcMain.on("window-close", () => window.close());
ipcMain.on("window-drag", (event, { deltaX, deltaY }) => {
	const [x, y] = window.getPosition();
	window.setPosition(x + deltaX, y + deltaY);
});

function createWindow() {
	window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		frame: false,
	});
	window.loadFile("index.html");

	window.on("closed", () => {
		window = null;
	});
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(createWindow);
