let lastClickTime = 0;

/**
 * Checks if the user can click in the active trade.
 *
 * @returns True if the user can click in the active trade.
 */
export const canClickInActiveTrade = (): boolean => {
	const now = time();
	if (now - lastClickTime > 0.5) {
		return true;
	}
	lastClickTime = now;

	return false;
};
