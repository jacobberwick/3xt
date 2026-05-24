async function loadNotes() {
	const notes = await Notes.getAllDocuments();
	const notesList = document.getElementById("notes-list");

	notesList.innerHTML = "";

	notes.forEach((note) => {
		const noteElement = document.createElement("li");

		const titleButton = document.createElement("button");
		titleButton.textContent = "> " + note.title;
		titleButton.className = "item-title";
		//TODO VADIM
		// titleButton.addEventListener("click", () => openNote(note._id));

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