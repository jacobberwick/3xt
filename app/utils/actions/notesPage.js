import { Notes } from "../database/notes.js";
import { now } from "../helpers.js";
import fs from "../fileSystem.js";

export async function loadNotes() {
	const notes = await Notes.getAllDocuments();
	const notesList = document.getElementById("notes-list");
	notesList.innerHTML = "";

	for (const note of notes) {
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
	}
}

export async function newNote() {
	const notesFolder = `${globalThis.userDataPath}/3xt_notes`;
	await fs.createDir(notesFolder);

	const newNoteFile = `${notesFolder}/${now().replaceAll(":", "-").replaceAll(".", "-")}.md`;
	await fs.writeFile(newNoteFile, "example text");

	await Notes.create("untitled", newNoteFile);
	await loadNotes();
}

export async function openNote(id) {
	globalThis.activeNoteId = id;
	const activeNote = await Notes.getDocument(id);
	const activeNoteContent = await fs.readFile(activeNote.file_path);

	const noteTitle = document.getElementById("note-title-input");
	noteTitle.value = activeNote.title;
}

export async function saveNote(id, newContent) {
	const activeNote = await Notes.getDocument(id);
	await fs.writeFile(activeNote.file_path, newContent);
}

export async function deleteNote(id) {
	const activeNote = await Notes.getDocument(id);
	const filePath = activeNote.file_path;

	await Notes.delete(id);
	await fs.deleteFile(filePath);

	if (globalThis.activeNoteId === id) {
		globalThis.activeNoteId = null;
		document.getElementById("note-title-input").value = "";
	}

	await loadNotes();
}

export async function syncNotes() {
	const exists = await fs.fileExists(note.file_path);
	if (!exists) {
		await Notes.delete(note._id);
	}
}

// ─── App Window ───────────────────────────────────────────────────

export function initNotesPage() {
	document
		.getElementById("btn-newnote")
		.addEventListener("click", () => newNote());

	let titleTimer = null;
	const editableTitle = document.getElementById("note-title-input");
	editableTitle.addEventListener("input", () => {
		clearTimeout(titleTimer);
		titleTimer = setTimeout(async () => {
			if (globalThis.activeNoteId) {
				await Notes.update(globalThis.activeNoteId, {
					title: editableTitle.value,
				});
				loadNotes();
			}
		}, 500);
	});
}
