const { ipcRenderer } = require("electron");

document.getElementById("btn-minimize").addEventListener("click", () => {
	ipcRenderer.send("window-minimize");
});

document.getElementById("btn-maximize").addEventListener("click", () => {
	ipcRenderer.send("window-maximize");
});

document.getElementById("btn-close").addEventListener("click", () => {
	ipcRenderer.send("window-close");
});

const titleBar = document.getElementById("title-bar");

let isDragging = false;
let startX, startY;

titleBar.addEventListener("mousedown", (e) => {
	if (e.target.closest("#window-controls")) return;
	isDragging = true;
	startX = e.screenX;
	startY = e.screenY;
});

document.addEventListener("mousemove", (e) => {
	if (!isDragging) return;

	const deltaX = e.screenX - startX;
	const deltaY = e.screenY - startY;

	ipcRenderer.send("window-drag", { deltaX, deltaY });

	startX = e.screenX;
	startY = e.screenY;
});

document.addEventListener("mouseup", () => {
	isDragging = false;
});

document.getElementById("notes").addEventListener("click", () => {
	globalThis.location.href = "index.html";
});

document.getElementById("boards").addEventListener("click", () => {
	globalThis.location.href = "boards.html";
});

const notesBtn = document.getElementById("notes");
if (!notesBtn.classList.contains("active")) {
	notesBtn.addEventListener("click", () => {
		globalThis.location.href = "index.html";
	});
}

const boardsBtn = document.getElementById("boards");
if (!boardsBtn.classList.contains("active")) {
	boardsBtn.addEventListener("click", () => {
		globalThis.location.href = "boards.html";
	});
}

testNote();
