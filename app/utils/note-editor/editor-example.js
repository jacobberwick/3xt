import {
	EditorView,
	Decoration,
	ViewPlugin,
	WidgetType,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

// ─── Widgets ─────────────────────────────────────────────────────────────────

class HorizontalRuleWidget extends WidgetType {
	toDOM() {
		const el = document.createElement("hr");
		el.className = "cm-rendered-hr";
		return el;
	}
}

class BulletWidget extends WidgetType {
	toDOM() {
		const el = document.createElement("span");
		el.textContent = "• ";
		el.className = "cm-rendered-bullet-marker";
		return el;
	}
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Hides opening/closing markers and styles the text between them
function addInlineDecoration(
	builder,
	lineFrom,
	matchIndex,
	markerLength,
	textLength,
	className,
) {
	const matchStart = lineFrom + matchIndex;
	const textStart = matchStart + markerLength;
	const textEnd = textStart + textLength;
	const matchEnd = textEnd + markerLength;

	builder.add(matchStart, textStart, Decoration.replace({}));
	builder.add(textStart, textEnd, Decoration.mark({ class: className }));
	builder.add(textEnd, matchEnd, Decoration.replace({}));
}

// Applies inline decorations for a given regex pattern
function applyInlinePattern(
	builder,
	lineFrom,
	lineText,
	regex,
	markerLength,
	className,
) {
	let match;
	while ((match = regex.exec(lineText)) !== null) {
		addInlineDecoration(
			builder,
			lineFrom,
			match.index,
			markerLength,
			match[1].length,
			className,
		);
	}
}

// ─── Inline Patterns ─────────────────────────────────────────────────────────

const inlinePatterns = [
	{ regex: /\*\*(.*?)\*\*/g, markerLength: 2, className: "cm-rendered-bold" },
	{
		regex: /(?<!\*)\*(?!\*)(.*?)\*/g,
		markerLength: 1,
		className: "cm-rendered-italic",
	},
	{
		regex: /~~(.*?)~~/g,
		markerLength: 2,
		className: "cm-rendered-strikethrough",
	},
	{ regex: /`([^`]+)`/g, markerLength: 1, className: "cm-rendered-inlinecode" },
];

// ─── Plugin ──────────────────────────────────────────────────────────────────

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
					const { text: lineText, from: lineFrom, to: lineTo } = line;
					const cursorOnLine =
						selection.from >= lineFrom && selection.from <= lineTo;

					if (!cursorOnLine) {
						// Headings
						const headingMatch = lineText.match(/^(#{1,6})\s+/);
						if (headingMatch) {
							const level = headingMatch[1].length;
							const prefixEnd = lineFrom + headingMatch[0].length;
							builder.add(lineFrom, prefixEnd, Decoration.replace({}));
							builder.add(
								prefixEnd,
								lineTo,
								Decoration.mark({ class: `cm-rendered-h${level}` }),
							);
							pos = lineTo + 1;
							continue;
						}

						// Horizontal rule
						if (lineText.match(/^---+$/)) {
							builder.add(
								lineFrom,
								lineTo,
								Decoration.replace({ widget: new HorizontalRuleWidget() }),
							);
							pos = lineTo + 1;
							continue;
						}

						// Inline patterns — bold, italic, strikethrough, code
						for (const { regex, markerLength, className } of inlinePatterns) {
							regex.lastIndex = 0; // reset regex state
							applyInlinePattern(
								builder,
								lineFrom,
								lineText,
								regex,
								markerLength,
								className,
							);
						}

						// Bullet lists
						const bulletMatch = lineText.match(/^(\s*)-\s+/);
						if (bulletMatch) {
							const prefixEnd = lineFrom + bulletMatch[0].length;
							builder.add(
								lineFrom,
								prefixEnd,
								Decoration.replace({ widget: new BulletWidget() }),
							);
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
