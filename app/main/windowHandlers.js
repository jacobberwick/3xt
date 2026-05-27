import { ipcMain } from "electron";

/**
 * Registers IPC handlers for window control actions.
 * Called from createWindow() so handlers have access to the mainWindow instance.
 *
 * Registered channels:
 * - window-minimize — minimize the window
 * - window-maximize — toggle maximize
 * - window-close    — close the window
 * - window-drag     — move the window by deltaX/deltaY
 *
 * @export
 * @param {BrowserWindow} mainWindow - the Electron BrowserWindow instance to control
 */
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
