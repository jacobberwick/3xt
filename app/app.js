import {
    initWindowControls,
    initWindowDrag,
    initWindowNavigation,
} from "./utils/appActions.js";
import { initBoardsPage } from "./utils/pages/boardPage.js";
import { initGridsPage } from "./utils/pages/gridsPage.js";
import { initNotesPage, loadNotes } from "./utils/pages/notesPage.js";


initWindowControls();
initWindowDrag();
initWindowNavigation();

const currentWindowPath = globalThis.location.pathname;
const isNotesPage = currentWindowPath.includes("index.html") || currentWindowPath === "/";
const isBoardsPage = currentWindowPath.includes("boards.html");
const isGridsPage = currentWindowPath.includes("grids.html");

globalThis.electronAPI.on("userDocuments", (data) => {
    globalThis.userDataPath = data;

	if (currentWindowPath.includes("index.html") || currentWindowPath === "/") {
		initNotesPage();
		loadNotes();
	}

	if (currentWindowPath.includes("boards.html")) initBoardsPage();

	if (currentWindowPath.includes("grids.html")) initGridsPage();
});
