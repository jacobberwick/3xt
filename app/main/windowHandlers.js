import { ipcMain } from "electron";

export function initWindowHandlers(mainWindow) {
	ipcMain.on("window-minimize", () => mainWindow.minimize());
	ipcMain.on("window-maximize", () => {
		mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
	});
	ipcMain.on("window-close", () => mainWindow.close());
	ipcMain.on("window-drag", (event, { deltaX, deltaY }) => {
		const [x, y] = mainWindow.getPosition();
		mainWindow.setPosition(x + deltaX, y + deltaY);
	});
}
