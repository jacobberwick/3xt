class BoardDB extends BaseDB {
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

const Boards = new BoardDB();
