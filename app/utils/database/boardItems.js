import { now, generateId } from "../helpers.js";
import { BaseDB } from "./baseDB.js";

class BoardItemsDB extends BaseDB {
	constructor() {
		super("3xt_boardItems", "boardItem");
	}

	async create(
		board,
		title,
		description,
		media_type,
		media_path,
		tags = [],
		links = [],
	) {
		const boardItem = {
			_id: generateId("boardItem"),
			type: "boardItem",
			board_id: board,
			title,
			description,
			media_type,
			media_path,
			tags,
			links,
			created_at: now(),
			updated_at: now(),
		};

		return await this.add(boardItem);
	}

	async getBoardItems(id) {
		const allBoardItems = await this.getAllDocuments();
		return allBoardItems.filter((boardItem) => boardItem.board_id === id);
	}
}

export const BoardItems = new BoardItemsDB();