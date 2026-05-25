const fs = require("node:fs");
const path = require("node:path");

async function loadNotes() {
	const notes = await Notes.getAllDocuments();
	const notesList = document.getElementById("notes-list");

	notesList.innerHTML = "";

	notes.forEach((note) => {
		const noteElement = document.createElement("li");

		const titleButton = document.createElement("button");
		titleButton.textContent = "> " + note.title;
		titleButton.className = "item-title";
		titleButton.addEventListener("click", () => openNote(note._id));

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "×";
		deleteButton.className = "item-delete";
		deleteButton.addEventListener("click", () => deleteNote(note._id));

		noteElement.appendChild(titleButton);
		noteElement.appendChild(deleteButton);
		notesList.appendChild(noteElement);
	});
}

async function newNote() {
	const notesFolder = path.join(globalThis.userDataPath, "3xt_notes");
	fs.mkdirSync(notesFolder, { recursive: true });
	const newNoteFile = path.join(
		notesFolder,
		now().replaceAll(":", "-").replaceAll(".", "-") + ".md",
	);
	fs.writeFileSync(newNoteFile, "");

	await Notes.create("untitled", newNoteFile);
	await loadNotes();
}

async function openNote(id) {
	globalThis.activeNoteId = id;
	const activeNote = await Notes.getDocument(id);
	const activeNoteContent = fs.readFileSync(activeNote.file_path, "utf-8");

	const noteTitle = document.getElementById("note-title");
	noteTitle.value += activeNote.title;

	// const textArea = document.getElementById("note-editor");
	// textArea.value = activeNoteContent;

	// const notePreview = document.getElementById("note-preview");
	// notePreview.innerHTML = marked.parse(activeNoteContent);
}

async function saveNote(id, newContent) {
	const activeNote = await Notes.getDocument(id);
	fs.writeFileSync(activeNote.file_path, newContent);
}

async function deleteNote(id) {
	const activeNote = await Notes.getDocument(id);
	const filePath = activeNote.file_path;
	await Notes.delete(id);
	fs.unlinkSync(filePath);

	if (globalThis.activeNoteId === id) {
		globalThis.activeNoteId = null;
		document.getElementById("note-title").value = "";
		// document.getElementById("note-editor").value = "";
		// document.getElementById("note-preview").innerHTML = "";
	}

	await loadNotes();
}
