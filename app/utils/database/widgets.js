import { now, generateId } from "../helpers.js";
import { BaseDB } from "./baseDB.js";

class WidgetsDB extends BaseDB {
	constructor() {
		super("3xt_widgets", "widget");
	}

	async create(widgetPage, widget_type, position = {}, config = {}) {
		const widget = {
			_id: generateId("widget"),
			widgetPage_id: widgetPage,
			widget_type,
			position,
			config,
			created_at: now(),
			updated_at: now(),
		};

		return await this.add(widget);
	}

	async getWidgets(id) {
		const allWidgets = await this.getAllDocuments();
		return allWidgets.filter((widget) => widget.widgetPage_id === id);
	}
}

export const Widgets = new WidgetsDB();