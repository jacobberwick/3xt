import { now, generateId } from "../helpers.js";
import { BaseDB } from "./baseDB.js";

class BoardsDB extends BaseDB {
	constructor() {
		super("3xt_boards", "board");
	}

	async create(title, tags = []) {
		const board = {
			_id: generateId("board"),
			type: "board",
			title,
			tags,
			created_at: now(),
			updated_at: now(),
		};

		return await this.add(board);
	}
}

export const Boards = new BoardsDB();