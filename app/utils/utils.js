function generateId(prefix) {
	// Using timestamp ensures documents are sorted chronologically by allDocs()
	return `${prefix}::${new Date().toISOString()}`;
}

function now() {
	return new Date().toISOString();
}

async function testNote() {
}