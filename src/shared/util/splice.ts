/**
 * Creates a slice of an array, similar to JavaScript's `Array.slice`.
 *
 * @param array The array.
 * @param start The start index.
 * @param endPos The end index.
 * @returns The sliced array.
 */
export function slice<T extends defined>(array: ReadonlyArray<T>, start = 0, endPos = array.size()): Array<T> {
	if (start < 0) {
		start = array.size() + start;
		endPos = array.size();
	}

	if (endPos < 0) {
		endPos = array.size() + endPos;
	}

	return array.move(math.max(0, start), endPos - 1, 0, []);
}
