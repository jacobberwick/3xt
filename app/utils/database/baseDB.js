import * as PouchDBModule from "pouchdb-browser";
const PouchDB = PouchDBModule.default || PouchDBModule;
import { now } from "../helpers.js";

export class BaseDB {
	#db;
	#prefix;

	constructor(name, prefix) {
		this.#db = new PouchDB(name);
		this.#prefix = prefix;
	}

	async getDocument(id) {
		return await this.#db.get(id);
	}

	async getAllDocuments() {
		const result = await this.#db.allDocs({
			include_docs: true,
			startkey: `${this.#prefix}::`,
			endkey: `${this.#prefix}::\uffff`,
		});
		return result.rows.map((row) => row.doc);
	}

	async add(doc) {
		return await this.#db.put(doc);
	}

	async update(id, changes) {
		const doc = await this.getDocument(id);
		const updated = { ...doc, ...changes, updated_at: now() };

		return await this.#db.put(updated);
	}

	async delete(id) {
		const doc = await this.getDocument(id);
		return await this.#db.remove(doc);
	}

	async bulkDelete(ids) {
		const docs = await Promise.all(ids.map((id) => this.getDocument(id)));
		const deletedDocs = docs.map((doc) => ({ ...doc, _deleted: true }));
		return await this.#db.bulkDocs(deletedDocs);
	}
}
