async function loadGrids() {
	const grids = await Grids.getAllDocuments();
	const gridsList = document.getElementById("grids-list");

	gridsList.innerHTML = "";

	grids.forEach((grid) => {
		const gridElement = document.createElement("li");

		const titleButton = document.createElement("button");
		titleButton.textContent = "> " + grid.title;
		titleButton.className = "item-title";
		//TODO VADIM
		// titleButton.addEventListener("click", () => openGrid(grid._id));

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "×";
		deleteButton.className = "item-delete";
		deleteButton.addEventListener("click", () => deleteGrid(grid._id));

		gridElement.appendChild(titleButton);
		gridElement.appendChild(deleteButton);
		gridsList.appendChild(gridElement);
	});
}

async function newGrid() {
	await Grids.create("temp");
	await loadGrids();
}

async function saveGrid(id, title, tags = []) {
	await Grids.update(id, { title: title, tags: tags });
	await loadGrids();
}

async function deleteGrid(id) {
	await Grids.delete(id);
	await loadGrids();
}
