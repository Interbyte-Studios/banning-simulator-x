/**
 * Linearly interpolates between two values.
 *
 * @param start The start value to lerp from.
 * @param finish The finish value to lerp to.
 * @param alpha The alpha value to lerp by.
 * @returns The lerped value.
 */
export const lerp = (start: number, finish: number, alpha: number): number => {
	debug.setmemorycategory("customLerp");
	return start + (finish - start) * alpha;
};
