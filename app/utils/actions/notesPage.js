async function loadNotes() {
	const notes = await Notes.getAllDocuments();
	const notesList = document.getElementById("notes-list");

	notesList.innerHTML = "";

	notes.forEach((note) => {
		const noteElement = document.createElement("li");

		const titleBtn = document.createElement("button");
		titleBtn.textContent = note.title;
		titleBtn.className = "note-title";
		//TODO VADIM
		// titleBtn.addEventListener("click", () => openNote(note._id));

		const deleteBtn = document.createElement("button");
		deleteBtn.textContent = "×";
		deleteBtn.className = "note-delete";
		//TODO VADIM
		// deleteBtn.addEventListener("click", () => deleteNote(note._id));

		noteElement.appendChild(titleBtn);
		noteElement.appendChild(deleteBtn);
		notesList.appendChild(noteElement);
	});
}

async function newNote() {
	await Notes.create("temp");
	await loadNotes();
}

async function saveNote(id, newContent) {
	await Notes.update(id, { content: newContent });
	await loadNotes();
}

async function deleteNote(id) {
	await Notes.delete(id);
	await loadNotes();
}
