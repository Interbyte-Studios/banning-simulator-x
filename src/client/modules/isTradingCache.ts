let isTrading = false;

/**
 * Toggles the trading state.
 *
 * @param value The toggled value.
 */
export function setIsTrading(value: boolean): void {
	isTrading = value;
}

/**
 * @returns The state of trading.
 */
export function getIsTrading(): boolean {
	return isTrading;
}
