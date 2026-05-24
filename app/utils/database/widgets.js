class WidgetsDB extends BaseDB {
    constructor() {
        super("3xt_widgets", "widget")
    }

    async create(widget_type, position = {}, config = {}) {
        const widget = {
            _id: generateId("widget"),
            widget_type,
            position,
            config,
            createdAt: now(),
            updatedAt: now()
        }

        return await this.add(widget)
    }
}

const Widgets = new WidgetsDB()