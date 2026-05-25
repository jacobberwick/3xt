const { ipcRenderer } = require("electron");

ipcRenderer.on("userData", (event, data) => {
	globalThis.userDataPath = data;
});

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
document.getElementById("grids").addEventListener("click", () => {
	globalThis.location.href = "grids.html";
});

const currentWindowPath = globalThis.location.pathname;

if (currentWindowPath.includes("index.html")) {
	document
		.getElementById("btn-newnote")
		.addEventListener("click", () => newNote());
	loadNotes();

	let saveTimer = null;
	// const noteEditor = document.getElementById("note-editor");

	// noteEditor.addEventListener("input", () => {
	// 	const notePreview = document.getElementById("note-preview");
	// 	notePreview.innerHTML = marked.parse(noteEditor.value);

	// 	clearTimeout(saveTimer);
	// 	saveTimer = setTimeout(() => {
	// 		if (globalThis.activeNoteId)
	// 			saveNote(globalThis.activeNoteId, noteEditor.value);
	// 	}, 1000);
	// });

	let titleTimer = null;
	const editableTitle = document.getElementById("note-title");
	editableTitle.addEventListener("input", () => {
		clearTimeout(titleTimer);
		titleTimer = setTimeout(async () => {
			if (globalThis.activeNoteId) {
				await Notes.update(globalThis.activeNoteId, {
					title: editableTitle.value,
				});
				await loadNotes();
			}
		}, 500);
	});
}

if (currentWindowPath.includes("boards.html")) {
	document
		.getElementById("btn-newboard")
		.addEventListener("click", () => newBoard());
	loadBoards();
}

if (currentWindowPath.includes("grids.html")) {
	document
		.getElementById("btn-newgrid")
		.addEventListener("click", () => newGrid());
	loadGrids();
}
