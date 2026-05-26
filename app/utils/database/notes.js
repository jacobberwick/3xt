import { now, generateId } from "../helpers.js";
import { BaseDB } from "./baseDB.js";

class NotesDB extends BaseDB {
	constructor() {
		super("3xt_notes", "note");
	}

	async create(title, filepath, tags = []) {
		const note = {
			_id: generateId("note"),
			type: "note",
			title,
			file_path: filepath,
			tags,
			created_at: now(),
			updated_at: now(),
		};

		return await this.add(note);
	}

	async search(query) {
		const allNotes = await this.getAllDocuments();
		const q = query.toLowerCase();
		return allNotes.filter((note) => note.title.toLowerCase().includes(q));
	}
}

export const Notes = new NotesDB();