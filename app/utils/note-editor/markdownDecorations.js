import {
	EditorView,
	Decoration,
	ViewPlugin,
	WidgetType,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

// A "widget" is a custom HTML element CodeMirror inserts into the editor
class HeadingWidget extends WidgetType {
	constructor(text, level) {
		super();
		this.text = text;
		this.level = level;
	}

	toDOM() {
		const el = document.createElement(`h${this.level}`);
		el.textContent = this.text;
		el.className = `cm-rendered-h${this.level}`;
		return el;
	}
}

class HorizontalRuleWidget extends WidgetType {
	toDOM() {
		const el = document.createElement("hr");
		el.className = "cm-rendered-hr";
		return el;
	}
}

class BoldWidget extends WidgetType {
	constructor(text) {
		super();
		this.text = text;
	}

	toDOM() {
		const el = document.createElement("strong");
		el.textContent = this.text;
		el.className = "cm-rendered-bold";
		return el;
	}
}

class taskListWidget extends WidgetType {
	constructor(indentLevel, isChecked) {
		super();
		this.isChecked = isChecked;
		this.indentLevel = indentLevel;
	}
	
	
	toDOM() {
		const el = document.createElement("input");
		el.type = "checkbox";
		el.style.paddingLeft = `${this.indentLevel*2}em`;
		el.checked = this.isChecked;
		return el;
	}
}

class BulletWidget extends WidgetType {
	constructor(level) {
		super();
		this.level = level;
	}
	
	
	toDOM() {
		const el = document.createElement("span");
		el.textContent = "― ";
		el.className = `cm-rendered-bullet-marker`;
		el.style.paddingLeft = `${this.level*2}em`;
		return el;
	}
}

// This plugin runs every time the editor view updates
export const markdownRenderPlugin = ViewPlugin.fromClass(
	class {
		constructor(view) {
			this.decorations = this.buildDecorations(view);
		}

		update(update) {
			if (update.docChanged || update.selectionSet || update.viewportChanged) {
				this.decorations = this.buildDecorations(update.view);
			}
		}

		buildDecorations(view) {
			const builder = new RangeSetBuilder();
			const selection = view.state.selection.main;

			for (const { from, to } of view.visibleRanges) {
				for (let pos = from; pos <= to; ) {
					const line = view.state.doc.lineAt(pos);
					const lineText = line.text;
					const lineFrom = line.from;
					const lineTo = line.to;

					// Check if cursor is on this line
					const cursorOnLine =
						selection.from >= lineFrom && selection.from <= lineTo;

					if (!cursorOnLine) {
						// Render headings
						// Render headings - only hide the "# " prefix, style the rest
						const headingMatch = lineText.match(/^(#{1,6})\s+/);
						if (headingMatch) {
							const level = headingMatch[1].length;
							const prefixEnd = lineFrom + headingMatch[0].length;

							// Hide just the "# " part
							builder.add(lineFrom, prefixEnd, Decoration.replace({}));

							// Style the remaining text
							builder.add(
								prefixEnd,
								lineTo,
								Decoration.mark({
									class: `cm-rendered-h${level}`,
								}),
							);
							pos = lineTo + 1;
							continue;
						}

						const hrMatch = lineText.match(/^---+$/);
						if (hrMatch) {
							builder.add(
								lineFrom,
								lineTo,
								Decoration.replace({
									widget: new HorizontalRuleWidget(),
								}),
							);
							pos = lineTo + 1;
							continue;
						}

						// Render bold
						// Render bold - hide the ** markers, style the text
						const boldRegex = /\*\*(.*?)\*\*/g;
						let boldMatch;
						while ((boldMatch = boldRegex.exec(lineText)) !== null) {
							const matchStart = lineFrom + boldMatch.index;
							const textStart = matchStart + 2; // skip opening **
							const textEnd = textStart + boldMatch[1].length;
							const matchEnd = textEnd + 2; // skip closing **

							// Hide opening **
							builder.add(matchStart, textStart, Decoration.replace({}));

							// Style the bold text
							builder.add(
								textStart,
								textEnd,
								Decoration.mark({ class: "cm-rendered-bold" }),
							);

							// Hide closing **
							builder.add(textEnd, matchEnd, Decoration.replace({}));
						}

						// Render italic - hide the * markers, style the text
						const italicRegex = /(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g;
						let italicMatch;
						while ((italicMatch = italicRegex.exec(lineText)) !== null) {
							const matchStart = lineFrom + italicMatch.index;
							const textStart = matchStart + 1; // skip opening *
							const textEnd = textStart + italicMatch[1].length;
							const matchEnd = textEnd + 1; // skip closing *

							// Hide opening *
							builder.add(matchStart, textStart, Decoration.replace({}));

							// Style the italic text
							builder.add(
								textStart,
								textEnd,
								Decoration.mark({ class: "cm-rendered-italic" }),
							);

							// Hide closing *
							builder.add(textEnd, matchEnd, Decoration.replace({}));
						}

						const strikethroughRegex = /~~(.*?)~~/g;
						let strikethroughMatch;
						while (
							(strikethroughMatch = strikethroughRegex.exec(lineText)) !== null
						) {
							const matchStart = lineFrom + strikethroughMatch.index;
							const textStart = matchStart + 2; // skip opening *
							const textEnd = textStart + strikethroughMatch[1].length;
							const matchEnd = textEnd + 2; // skip closing *

							builder.add(matchStart, textStart, Decoration.replace({}));

							builder.add(
								textStart,
								textEnd,
								Decoration.mark({ class: "cm-rendered-strikethrough" }),
							);

							builder.add(textEnd, matchEnd, Decoration.replace({}));
						}

						// Render inline code
						// Render inline code - hide the ``**`` markers, style the text
						const inlinecodeRegex = /`([^`]+)`/g;
						let inlinecodeMatch;
						while (
							(inlinecodeMatch = inlinecodeRegex.exec(lineText)) !== null
						) {
							const matchStart = lineFrom + inlinecodeMatch.index;
							const textStart = matchStart + 1; // skip opening `
							const textEnd = textStart + inlinecodeMatch[1].length;
							const matchEnd = textEnd + 1; // skip closing `

							// Hide opening `
							builder.add(matchStart, textStart, Decoration.replace({}));

							// Style the bold text
							builder.add(
								textStart,
								textEnd,
								Decoration.mark({ class: "cm-rendered-inlinecode" }),
							);

							// Hide closing `
							builder.add(textEnd, matchEnd, Decoration.replace({}));
						}

						const checkedMatch = lineText.match(/^(\s*)-\s+\[( |x)\]\s+/);
						if (checkedMatch) {
							console.log(checkedMatch[0])
							const prefixEnd = lineFrom + checkedMatch[0].length;
							const indentLevel = checkedMatch[1].length/2;
							const isChecked = checkedMatch[2] === "x";
							// Replace "- " with "― "
							builder.add(
								lineFrom,
								prefixEnd,
								Decoration.replace({
									widget: new taskListWidget(indentLevel, isChecked),
								}),
							);

							// Style the list item text
							builder.add(
								prefixEnd,
								lineTo,
								Decoration.mark({ class: "cm-rendered-task-list" }),
							);
						}

												// Render bullet lists - hide the "- " prefix, add bullet styling
						const bulletMatch = lineText.match(/^(\s*)-\s+/);
						if (bulletMatch && !checkedMatch) {
							const prefixEnd = lineFrom + bulletMatch[0].length;
							const indentLevel = bulletMatch[1].length/2;
							// Replace "- " with "― "
							builder.add(
								lineFrom,
								prefixEnd,
								Decoration.replace({
									widget: new BulletWidget(indentLevel),
								}),
							);

							// Style the list item text
							builder.add(
								prefixEnd,
								lineTo,
								Decoration.mark({ class: "cm-rendered-bullet" }),
							);
						}
					}

					pos = lineTo + 1;
				}
				
			}

			return builder.finish();
		}
		
	},
	{ decorations: (v) => v.decorations },
);