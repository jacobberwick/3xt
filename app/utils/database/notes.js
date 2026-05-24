class NotesDB extends BaseDB {
	constructor() {
		super("3xt_notes", "note");
	}

	async create(title, content = "", tags = []) {
		const note = {
			_id: generateId("note"),
			type: "note",
			title,
			content,
			tags,
			created_at: now(),
			updated_at: now(),
		};

        return await this.add(note);
	}

	async search(query) {
		const allNotes = await this.getAllDocuments();
		const q = query.toLowerCase();
		return allNotes.filter(
			(note) =>
				note.title.toLowerCase().includes(q) ||
				note.content.toLowerCase().includes(q),
		);
	}
}

const Notes = new NotesDB();