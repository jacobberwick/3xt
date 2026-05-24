async function loadBoards() {
	const boards = await Boards.getAllDocuments();
	boards.forEach((board) => {
		console.log(board._id, board.title);
	});
}