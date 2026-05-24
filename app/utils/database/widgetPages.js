class WidgetPagesDB extends BaseDB {
    constructor() {
        super("3xt_widgetPages", "widgetPage")
    }

    async create(title, widgets = [], tags = []) {
        const widgetPage = {
            _id: generateId("widgetPage"),
            type: "widgetPage",
            title,
            widgets,
            tags,
            created_at: now(),
            updated_at: now()
        }

        return await this.add(widgetPage);
    }
}

const WidgetPages = new WidgetPagesDB();