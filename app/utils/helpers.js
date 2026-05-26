export function generateId(prefix) {
	// Using timestamp ensures documents are sorted chronologically by allDocs()
	return `${prefix}::${new Date().toISOString()}`;
}

export function now() {
	return new Date().toISOString();
}