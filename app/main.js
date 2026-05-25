const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow = null;

ipcMain.on("window-minimize", () => mainWindow.minimize());
ipcMain.on("window-maximize", () => {
	mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});
ipcMain.on("window-close", () => mainWindow.close());
ipcMain.on("window-drag", (event, { deltaX, deltaY }) => {
	const [x, y] = mainWindow.getPosition();
	mainWindow.setPosition(x + deltaX, y + deltaY);
});

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		frame: false,
	});
	mainWindow.loadFile("app/index.html");

	mainWindow.webContents.on("did-finish-load", () => {
		mainWindow.webContents.send("userData", app.getPath("documents"));
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
