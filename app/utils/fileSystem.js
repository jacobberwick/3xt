const fs = {
	readFile: (filePath) => globalThis.electronAPI.readFile(filePath),
	writeFile: (filePath, content) =>
		globalThis.electronAPI.writeFile(filePath, content),
	deleteFile: (filePath) => globalThis.electronAPI.deleteFile(filePath),
	createDir: (dirPath) => globalThis.electronAPI.createDir(dirPath),
	getPath: (name) => globalThis.electronAPI.getPath(name),
	fileExists: (filePath) => globalThis.electronAPI.fileExists(filePath),
	renameFile: (oldPath, newPath) =>
		globalThis.electronAPI.renameFile(oldPath, newPath),
};

export default fs;
