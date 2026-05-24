class GridsDB extends BaseDB {
    constructor() {
        super("3xt_grids", "grid")
    }

    async create(title, tags = []) {
        const grid = {
            _id: generateId("grid"),
            type: "grid",
            title,
            tags,
            created_at: now(),
            updated_at: now()
        }

        return await this.add(grid);
    }
}

const Grids = new GridsDB();