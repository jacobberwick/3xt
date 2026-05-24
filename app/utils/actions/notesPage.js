async function loadNotes() {
	const notes = await Notes.getAllDocuments();
	notes.forEach((note) => {
		console.log(note._id, note.title);
		console.log(note.content);
		console.log(note.tags);
	});
}

async function saveNote(id, newContent) {
    await Notes.update(id, { content: newContent });
    await loadNotes();
}

async function deleteNote(id) {
    await Notes.delete(id);
    await loadNotes();
}
