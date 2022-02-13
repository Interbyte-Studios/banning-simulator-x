import { Currency } from "../currencies";

export interface Zone {
	/**
	 * The display name of the zone.
	 */
	name: string;
	/**
	 * The cost of the zone.
	 */
	cost?: {
		currency: Currency;
		amount: number;
	};
}
