class WidgetPagesDB extends BaseDB {
    constructor() {
        super("3xt_widgetPages", "widgetPage")
    }

    async create(title, tags = []) {
        const widgetPage = {
            _id: generateId("widgetPage"),
            type: "widgetPage",
            title,
            tags,
            created_at: now(),
            updated_at: now()
        }

        return await this.add(widgetPage);
    }
}

const WidgetPages = new WidgetPagesDB();