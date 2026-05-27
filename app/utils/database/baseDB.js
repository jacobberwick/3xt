import { now } from "../helpers.js";
import fs from "../fileSystem.js";

export class BaseDB {
    #prefix;
    #filePath;

    constructor(name, prefix) {
        this.#prefix = prefix;
        // each DB is one JSON file in the user's documents folder
        this.#filePath = null; // set later once we have userDataPath
        this._name = name;
    }

    // call this before any DB operation to get the file path
    async #getFilePath() {
        if (this.#filePath) return this.#filePath;
        const docsPath = await fs.getPath("documents");
        this.#filePath = `${docsPath}/3xt/${this._name}.json`;
        return this.#filePath;
    }

    // read all documents from the JSON file
    async #readAll() {
        const filePath = await this.#getFilePath();
        const exists = await fs.fileExists(filePath);
        if (!exists) return {};
        const content = await fs.readFile(filePath);
        return JSON.parse(content);
    }

    // write all documents back to the JSON file
    async #writeAll(data) {
        const filePath = await this.#getFilePath();
        // make sure the folder exists
        const docsPath = await fs.getPath("documents");
        await fs.createDir(`${docsPath}/3xt`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    async getDocument(id) {
        const data = await this.#readAll();
        if (!data[id]) throw new Error(`Document not found: ${id}`);
        return data[id];
    }

    async getAllDocuments() {
        const data = await this.#readAll();
        return Object.values(data)
            .filter(doc => doc._id.startsWith(this.#prefix));
    }

    async add(doc) {
        const data = await this.#readAll();
        data[doc._id] = doc;
        await this.#writeAll(data);
        return doc;
    }

    async update(id, changes) {
        const data = await this.#readAll();
        if (!data[id]) throw new Error(`Document not found: ${id}`);
        data[id] = { ...data[id], ...changes, updated_at: now() };
        await this.#writeAll(data);
        return data[id];
    }

    async delete(id) {
        const data = await this.#readAll();
        delete data[id];
        await this.#writeAll(data);
    }

    async bulkDelete(ids) {
        const data = await this.#readAll();
        ids.forEach(id => delete data[id]);
        await this.#writeAll(data);
    }
}