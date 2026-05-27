import { Notes } from "../database/notes.js";
import { now } from "../helpers.js";
import fs from "../fileSystem.js";
import { initEditor, setEditorContent } from "../note-editor/editor.js";

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

	document.getElementById("note-title-input").value = activeNote.title;
	document.getElementById("main-label").textContent = activeNote.title;

	// Initialize editor with content and auto-save on change
	initEditor(activeNoteContent, async (newContent) => {
		await saveNote(id, newContent);
	});
	setNoteOpen(true);
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

	setNoteOpen(false);
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
		.getElementById("btn-newnote-sidebar")
		.addEventListener("click", () => newNote());

	document
		.getElementById("btn-newnote-main")
		.addEventListener("click", () => newNote());

	let titleTimer = null;
	const editableTitle = document.getElementById("note-title-input");
	editableTitle.addEventListener("input", () => {
		clearTimeout(titleTimer);
		titleTimer = setTimeout(async () => {
			if (globalThis.activeNoteId) {
				const activeNote = await Notes.getDocument(globalThis.activeNoteId);

				const dir = activeNote.file_path.substring(
					0,
					activeNote.file_path.lastIndexOf("/"),
				);
				const newFileName =
					editableTitle.value
						.trim()
						.replace(/[<>:"/\\|?*]/g, "")
						.replace(/\s+/g, "-") || "untitled";
				const newFilePath = `${dir}/${newFileName}.md`;

				await fs.renameFile(activeNote.file_path, newFilePath);

				await Notes.update(globalThis.activeNoteId, {
					title: editableTitle.value,
					file_path: newFilePath,
				});

				document.getElementById("main-label").textContent = editableTitle.value;
				await loadNotes();
			}
		}, 500);
	});

	setNoteOpen(false);
}

// ─── Placeholder ───────────────────────────────────────────────────

function setNoteOpen(isOpen) {
	document.getElementById("note-placeholder").style.display = isOpen
		? "none"
		: "flex";
	document.getElementById("note-title").style.display = isOpen
		? "flex"
		: "none";
	document.getElementById("note-editor").style.display = isOpen
		? "block"
		: "none";
}
