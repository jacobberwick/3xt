import { now } from "../helpers.js";
import fs from "../fileSystem.js";

export class BaseDB {
	#db;
	#prefix;
	#table;

	constructor(name, prefix) {
		this.#db = new Dexie(name);
		this.#prefix = prefix;
		this.#db.version(1).stores({
			docs: "_id"
		});
		this.#table = this.#db.docs;
	}

	async getDocument(id) {
		return await this.#table.get(id);
	}

	async getAllDocuments() {
		return await this.#table
			.where("_id")
			.startsWith(`${this.#prefix}::`)
			.toArray();
	}

	async add(doc) {
		return await this.#table.put(doc);
	}

	async update(id, changes) {
		const doc = await this.getDocument(id);
		const updated = { ...doc, ...changes, updated_at: now() };

		return await this.#table.put(updated);
	}

	async delete(id) {
		return await this.#table.delete(id);
	}

	async bulkDelete(ids) {
		return await this.#table.bulkDelete(ids);
	}
}
