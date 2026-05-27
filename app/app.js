import {
	initWindowControls,
	initWindowDrag,
	initWindowNavigation,
} from "./utils/appActions.js";
import { initBoardsPage } from "./utils/actions/boardPage.js";
import { initGridsPage } from "./utils/actions/gridsPage.js";
import { initNotesPage, loadNotes } from "./utils/actions/notesPage.js";


initWindowControls();
initWindowDrag();
initWindowNavigation();

const currentWindowPath = globalThis.location.pathname;

globalThis.electronAPI.on("userDocuments", (data) => {
	globalThis.userDataPath = data;

	if (currentWindowPath.includes("index.html") || currentWindowPath === "/") {
		initNotesPage();
		loadNotes();
	}

	if (currentWindowPath.includes("boards.html")) initBoardsPage();

	if (currentWindowPath.includes("grids.html")) initGridsPage();
});
