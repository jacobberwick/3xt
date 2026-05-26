// ─── Window Controls ───────────────────────────────────────────────────
export function initWindowControls() {
	document.getElementById("btn-minimize").addEventListener("click", () => {
		globalThis.electronAPI.send("window-minimize");
	});

	document.getElementById("btn-maximize").addEventListener("click", () => {
		globalThis.electronAPI.send("window-maximize");
	});

	document.getElementById("btn-close").addEventListener("click", () => {
		globalThis.electronAPI.send("window-close");
	});
}

// ─── Window Drag ───────────────────────────────────────────────────
export function initWindowDrag() {
	const titleBar = document.getElementById("title-bar");

	let isDragging = false;
	let startX, startY;

	titleBar.addEventListener("mousedown", (e) => {
		if (e.target.closest("#window-controls")) return;
		isDragging = true;
		startX = e.screenX;
		startY = e.screenY;
	});

	document.addEventListener("mousemove", (e) => {
		if (!isDragging) return;

		const deltaX = e.screenX - startX;
		const deltaY = e.screenY - startY;

		globalThis.electronAPI.send("window-drag", { deltaX, deltaY });

		startX = e.screenX;
		startY = e.screenY;
	});

	document.addEventListener("mouseup", () => {
		isDragging = false;
	});
}

// ─── App Navigation ───────────────────────────────────────────────────
export function initWindowNavigation() {
	document.getElementById("notes").addEventListener("click", () => {
		globalThis.location.href = "index.html";
	});
	document.getElementById("boards").addEventListener("click", () => {
		globalThis.location.href = "boards.html";
	});
	document.getElementById("grids").addEventListener("click", () => {
		globalThis.location.href = "grids.html";
	});
}