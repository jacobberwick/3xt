import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { defaultKeymap } from "@codemirror/commands";
import { markdownRenderPlugin } from "./markdownDecorations.js";

let editor = null;

export function initEditor(initialContent = "", onChange = null) {
    if (editor) {
        editor.destroy();
    }

    const customTheme = EditorView.baseTheme({
        "&": { height: "100%", cursor: "text" },
        ".cm-scroller": { overflow: "auto" },
        ".cm-content": { minHeight: "100%", cursor: "text" },
        ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#c6a3f2 !important" },
    });

    const state = EditorState.create({
        doc: initialContent,
            extensions: [
                markdown({ base: markdownLanguage }),
                keymap.of(defaultKeymap),
                customTheme,
                markdownRenderPlugin, // 👈 add this
                EditorView.updateListener.of((update) => {
                    if (update.docChanged && onChange) {
                        onChange(update.state.doc.toString());
                    }
                }),
    ],
        
    });

    editor = new EditorView({
        state,
        parent: document.getElementById("note-editor"),
    });
}

export function getEditorContent() {
    return editor ? editor.state.doc.toString() : "";
}

export function setEditorContent(content) {
    if (!editor) return;
    editor.dispatch({
        changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: content,
        },
    });
}

