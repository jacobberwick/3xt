async function loadBoards() {
	const boards = await Boards.getAllDocuments();
	const boardsList = document.getElementById("boards-list");

	boardsList.innerHTML = "";

	boards.forEach((board) => {
		const boardElement = document.createElement("li");

		const titleButton = document.createElement("button");
		titleButton.textContent = "> " + board.title;
		titleButton.className = "item-title";
		//TODO VADIM
		// titleButton.addEventListener("click", () => openBoard(board._id));

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "×";
		deleteButton.className = "item-delete";
		deleteButton.addEventListener("click", () => deleteBoard(board._id));

		boardElement.appendChild(titleButton);
		boardElement.appendChild(deleteButton);
		boardsList.appendChild(boardElement);
	});
}

async function newBoard() {
	await Boards.create("temp");
	await loadBoards();
}

async function saveBoard(id, title, tags = []) {
	await Boards.update(id, { title: title, tags: tags });
	await loadBoards();
}

async function deleteBoard(id) {
	await Boards.delete(id);
	await loadBoards();
}